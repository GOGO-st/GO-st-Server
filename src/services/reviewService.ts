import Review from "../models/Review";
import Location from "../models/Location";
import { IReviewOutputDTO, IReviewMyOutputDTO } from "../interfaces/IReview";
import createError from "http-errors";

const rm = require("../modules/responseMessage");
const date = require("../modules/date");

/**
 * @특정_장소_리뷰_조회
 */
const getLocationReviewList = async locationId => {
  const reviews = await Review.find()
    .where("location")
    .equals(locationId)
    .populate("user", [
      "_id",
      "nickname",
      "created_at",
      "title",
      "content",
      "emoji",
    ])
    .sort({ created_at: -1 });
  let reviewDTOList: IReviewOutputDTO[] = [];

  for (let review of reviews) {
    let reviewDTO: IReviewOutputDTO = {
      _id: review._id,
      user: review.user._id,
      nickname: review.user.nickname,
      title: review.title,
      content: review.content,
      emoji: review.emoji,
      created_at: review.created_at,
    };
    reviewDTOList.push(reviewDTO);
  }

  return reviewDTOList;
};

/**
 * @리뷰_조회_By_ID
 */
const getReviewById = async reviewId => {
  const review = await Review.findById(reviewId);
  if (!review) return null;
  return review;
};

/**
 * @리뷰
 */
const review = async (userId, locationId, title, content, emoji, category) => {
  try {
    const review = new Review({
      user: userId,
      location: locationId,
      title: title,
      content: content,
      emoji: emoji,
      category: category,
      created_at: date.getDate(),
    });

    await review.save();
    return review;
  } catch (error) {
    console.log(error.message);
    throw createError(rm.INTERNAL_SERVER_ERROR);
  }
};

/**
 * @리뷰_체크후_작성
 */
const createReview = async (
  userId,
  x,
  y,
  locationName,
  locationAddress,
  title,
  content,
  emoji,
  category
) => {
  try {
    const isReviewed = await checkReviewed(x, y);

    if (isReviewed == false) {
      console.log("Checked isReviewed");
      const location = new Location({
        x: x,
        y: y,
        locationName: locationName,
        locationAddress: locationAddress,
        category: category,
        emoji: emoji,
      });

      await location.save();
      return await review(userId, location._id, title, content, emoji, [
        category,
      ]);
    } else {
      const location = await Location.findOne({ x: x, y: y });
      return await review(userId, location._id, title, content, emoji, [
        category,
      ]);
    }
  } catch (error) {
    console.log(error.message);
    throw createError(rm.INTERNAL_SERVER_ERROR);
  }
};

/**
 * @리뷰_조회
 */
const getReviews = async userId => {
  const myReviews = await Review.find()
    .where("user")
    .equals(userId)
    .sort({ created_at: -1 });

  if (myReviews.length == 0) return null;

  var myReviewsDTO: IReviewMyOutputDTO[] = [];

  for (let review of myReviews) {
    let location = await Location.findById(review.location);

    let myReview: IReviewMyOutputDTO = {
      _id: review._id,
      locationName: location.locationName,
      title: review.title,
      content: review.content,
      emoji: review.emoji,
      create_at: review.created_at,
    };

    myReviewsDTO.push(myReview);
  }

  return myReviewsDTO;
};

/**
 * @리뷰_여부_판별
 */
const checkReviewed = async (x, y) => {
  const review = await Location.findOne({ x: x, y: y });
  if (!review) return false;
  return true;
};

/**
 * @이모지_조회
 */
const getEmojies = async locationId => {
  let emojies = [];

  var reviews = await Review.find()
    .where("location")
    .equals(locationId)
    .populate("user", [
      "_id",
      "nickname",
      "created_at",
      "title",
      "content",
      "emoji",
    ])
    .sort({ created_at: -1 });

  if (reviews.length > 2) {
    const reviewsForEmoji = reviews.slice(0, 3);
    for (let review of reviewsForEmoji) {
      emojies.push(review.emoji);
    }
  } else {
    for (let review of reviews) {
      emojies.push(review.emoji);
    }
  }

  return emojies;
};

/**
 * @리뷰_삭제
 */
const deleteReview = async reviewId => {
  try {
    await Review.findByIdAndRemove({ _id: reviewId });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkReviewed,
  getLocationReviewList,
  createReview,
  getReviews,
  getEmojies,
  review,
  deleteReview,
  getReviewById,
};
