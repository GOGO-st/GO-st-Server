import Review from "../models/Review";
import {
  IReviewOutputDTO,
  IWriterDTO,
  IReviewMyOutputDTO,
} from "../interfaces/IReview";
import createError from "http-errors";

const rm = require("../modules/responseMessage");
const date = require("../modules/date");

const getLocationReviewList = async locationId => {
  const reviews = await Review.find()
    .where("location")
    .equals(locationId)
    .populate("user", ["_id", "nickname"])
    .sort({ created_at: -1 });
  let reviewDTOList: IReviewOutputDTO[] = [];

  for (let review of reviews) {
    let writerDTO: IWriterDTO = {
      _id: review.user._id,
      nickname: review.user.nickname,
    };
    let reviewDTO: IReviewOutputDTO = {
      _id: review._id,
      locationId: review.location._id,
      nickname: writerDTO,
      title: review.title,
      content: review.content,
      emoji: review.emoji,
      created_at: review.created_at,
    };
    reviewDTOList.push(reviewDTO);
  }

  return reviewDTOList;
};

const createReview = async (
  locationId,
  userId,
  title,
  content,
  emoji,
  category
) => {
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

const getMyReviews = async userId => {
  const myReviews = await Review.find({ user: userId })
    .populate("location")
    .sort({ created_at: -1 });

  if (myReviews.length == 0) return null;

  var myReviewsDTO: IReviewMyOutputDTO[] = [];

  for (let review of myReviews) {
    let myReview: IReviewMyOutputDTO = {
      _id: review._id,
      locationName: review.location.name,
      locationId: review.location._id,
      title: review.title,
      content: review.content,
      emoji: review.emoji,
      create_at: review.created_at,
    };
    myReviewsDTO.push(myReview);
  }

  return myReviewsDTO;
};

module.exports = {
  getLocationReviewList,
  createReview,
  getMyReviews,
};
