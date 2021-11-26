import auth from "../middleware/auth";
import createError from "http-errors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const mapService = require("../services/mapService");
const reviewService = require("../services/reviewService");
const userService = require("../services/userService");
const { success, fail } = require("../modules/util");

/**
 *  @route GET reviews/
 *  @desc 내가 작성한 리뷰 목록 리턴
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response, next) => {
  const userId = res.locals.userId;

  try {
    const reviews = await reviewService.getReviews(userId);

    if (!reviews) {
      return res.send(success(sc.NO_CONTENT, rm.NO_CONTENT, reviews));
    }

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.READ_MY_REVIEW_SUCCESS, reviews));
  } catch (error) {
    next(error);
  }
});

/**
 *  @route GET reviews/:locationId
 *  @desc 특정 장소에 대한 리뷰 리턴
 *  @access Public
 */
router.get("/:locationId", auth, async (req: Request, res: Response, next) => {
  const { locationId } = req.params;

  if (!locationId || !mongoose.isValidObjectId(locationId)) {
    return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));
  }

  try {
    const reviews = await reviewService.getLocationReviewList(locationId);
    if (reviews.length == 0) {
      res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CONTENT));
      next();
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.READ_REVIEW_SUCCESS, reviews));
  } catch (error) {
    next(error);
  }
});

/**
 *  @route POST reviews/
 *  @desc 새로운 리뷰 작성
 *  @access Public
 */
router.post("/", auth, async (req: Request, res: Response, next) => {
  if (!req.body) return next(createError(401, rm.NULL_VALUE));
  const userId = res.locals.userId;
  const { x, y } = req.query;
  const { locationName, locationAddress, title, content, emoji, category } =
    req.body;

  if (
    !locationName ||
    !locationAddress ||
    !x ||
    !y ||
    !category ||
    !content ||
    !title ||
    !emoji
  )
    return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));

  try {
    const review = await reviewService.createReview(
      userId,
      x,
      y,
      locationName,
      locationAddress,
      title,
      content,
      emoji,
      category
    );

    const location = await mapService.getLocationByPoint(x, y);
    let emojies = await reviewService.getEmojies(location._id);

    await mapService.updateLocationEmoji(emojies, review.location);

    res.status(sc.CREATED).send(success(sc.CREATED, rm.REVIEW_SUCCESS, review));
  } catch (error) {
    return next(error);
  }
});

/**
 *  @route GET reviews/other/
 *  @desc 다른 유저의 리뷰 목록 리턴
 *  @access Public
 */
router.get(
  "/other/:userId",
  auth,
  async (req: Request, res: Response, next) => {
    const { userId } = req.params;
    if (!userId)
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));

    const user = await userService.getUserInfo(userId);
    if (!user) return res.status(sc.NO_USER).send(fail(sc.NO_USER, rm.NO_USER));

    try {
      const nickname = user.nickname;
      const reviews = await reviewService.getReviews(userId);
      if (reviews == null) {
        return res
          .status(sc.NO_CONTENT)
          .send(fail(sc.NO_CONTENT, rm.NO_CONTENT));
      }
      const reviewCount = reviews.length;

      return res.status(sc.OK).send(
        success(sc.OK, rm.READ_REVIEW_LIST_SUCCESS, {
          nickname,
          reviewCount,
          reviews,
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

/**
 *  @route DELETE /reviews/:reviewId
 *  @desc 리뷰 삭제
 *  @access Public
 */
router.delete("/:reviewId", auth, async (req: Request, res: Response, next) => {
  const { reviewId } = req.params;
  const userId = res.locals.userId;

  if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
    return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));
  }

  try {
    const review = await reviewService.getReviewById(reviewId);
    if (!review)
      return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CONTENT));

    if (review.user != userId) {
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED));
    }

    const location = await reviewService.getReviewById(reviewId);
    const locationId = location.location;
    await reviewService.deleteReview(reviewId);
    await mapService.updateLocationEmojiAfterReviewDeleted(locationId);

    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_REVIEW_SUCCESS));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
