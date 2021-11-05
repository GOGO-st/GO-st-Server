// import auth from "../middleware/auth";
import createError from "http-errors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { check, validationResult } from "express-validator";

const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const locationService = require("../services/locationService");
const reviewService = require("../services/reviewService");
const { auth } = require("../middleware/auth");
const { success, fail } = require("../modules/util");

/**
 *  @route GET reviews/
 *  @desc 내가 작성한 리뷰 목록 리턴
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response, next) => {
  const userId = res.locals.userId;

  try {
    const reviews = await reviewService.getMyReviews(userId);
    if (reviews.length == 0) {
      res
        .status(sc.NO_CONTENT)
        .send(fail(sc.NO_CONTENT, rm.READ_MY_REVIEW_FAIL));
      next();
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
  const locationId = req.query.locationId;

  if (!locationId || !mongoose.isValidObjectId(locationId)) {
    next(createError(sc.BAD_REQUEST, rm.INVALID_IDENTIFIER));
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
 *  @route POST reviews/:locationId
 *  @desc 특정 장소에 대한 리뷰 작성
 *  @access Public
 */
router.post("/:locationId", auth, async (req: Request, res: Response, next) => {
  console.log(req.body);
  console.log(req);
  if (!req.body || !req.body.review)
    return next(createError(401, rm.NULL_VALUE));
  const reviewParams = JSON.parse(req.body.review);
  const locationId = req.query.cafe;
  const userId = res.locals.userId;
  const { title, content, emoji, category } = reviewParams;

  if (!content || !title || !emoji)
    next(createError(createError(sc.BAD_REQUEST, rm.NULL_VALUE)));

  if (!locationId || !mongoose.isValidObjectId(locationId)) {
    return next(createError(sc.BAD_REQUEST, rm.INVALID_IDENTIFIER));
  }

  try {
    const review = await reviewService.createReview(
      locationId,
      userId,
      title,
      content,
      emoji,
      category
    );
    res.status(sc.CREATED).send(success(sc.CREATED, rm.REVIEW_SUCCESS, review));
  } catch (error) {
    return next(error);
  }
});

/**
 *  @route GET reviews/other/:userId
 *  @desc 다른 유저의 리뷰 목록 리턴
 *  @access Public
 */
router.get(
  "/other/:userId",
  auth,
  async (req: Request, res: Response, next) => {
    const { userId } = req.body;

    try {
      const reviews = await reviewService.getMyReviews(userId);
      if (reviews.length == 0) {
        res
          .status(sc.NO_CONTENT)
          .send(fail(sc.NO_CONTENT, rm.READ_REVIEW_LIST_FAIL));
        next();
      }
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.READ_REVIEW_LIST_SUCCESS, reviews));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
