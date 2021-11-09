import Review from "../models/Review";
import Location from "../models/Location";
import {
  IReviewOutputDTO,
  IWriterDTO,
  IReviewMyOutputDTO,
} from "../interfaces/IReview";
import { ILocationForReviewDTO } from "../interfaces/ILocation";
import createError from "http-errors";
import User from "../models/User";

const mapService = require("../services/mapService");
const geoService = require("../services/geoService");
const rm = require("../modules/responseMessage");
const date = require("../modules/date");

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

const review = async (userId, locationId, title, content, emoji, category) => {
  try {
    const review = new Review({
      user: userId,
      location: locationId,
      title: title,
      content: content,
      emoji: emoji,
      category: [category],
      created_at: date.getDate(),
    });

    await review.save();
    return review;
  } catch (error) {
    console.log(error.message);
    throw createError(rm.INTERNAL_SERVER_ERROR);
  }
};

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
      const location = await mapService.saveCoord(
        x,
        y,
        locationName,
        locationAddress,
        [category],
        emoji
      );
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

const getReviews = async userId => {
  const myReviews = await Review.find()
    .where("user")
    .equals(userId)
    .sort({ created_at: -1 });

  if (myReviews.length == 0) return null;

  var myReviewsDTO: IReviewMyOutputDTO[] = [];

  for (let review of myReviews) {
    let myReview: IReviewMyOutputDTO = {
      _id: review._id,
      locationName: review.locationName,
      title: review.title,
      content: review.content,
      emoji: review.emoji,
      create_at: review.created_at,
    };
    myReviewsDTO.push(myReview);
  }

  return myReviewsDTO;
};

const checkReviewed = async (x, y) => {
  const review = await Location.findOne({ x: x, y: y });
  if (!review) return false;
  return true;
};

module.exports = {
  checkReviewed,
  getLocationReviewList,
  createReview,
  getReviews,
};
