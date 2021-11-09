import Location from "../models/Location";
import Review from "../models/Review";
import User from "../models/User";
import createError from "http-errors";
import { ILocationGeoDTO } from "../interfaces/ILocation";
import { IReviewOutputDTO } from "../interfaces/IReview";

const rm = require("../modules/responseMessage");

/**
 * @전체_장소_조회
 */
const getAllLocationList = async () => {
  var locations = await Location.find().select(
    "_id locationName locationAddress x y emoji"
  );

  let LocationGeoList: ILocationGeoDTO[] = [];

  for (let location of locations) {
    let point: ILocationGeoDTO = {
      _id: location._id,
      locationName: location.locationName,
      locationAddress: location.locationAddress,
      x: location.x,
      y: location.y,
      emoji: location.emoji,
    };
    LocationGeoList.push(point);
  }
  if (LocationGeoList.length == 0) {
    return null;
  }
  return LocationGeoList;
};

/**
 * @카테고리별_장소_조회
 */
const getLocationListByCategory = async category => {
  var locations = await Location.find({ category: { $regex: category } });

  let LocationGeoList: ILocationGeoDTO[] = [];

  for (let location of locations) {
    let point: ILocationGeoDTO = {
      _id: location._id,
      locationName: location.locationName,
      locationAddress: location.locationAddress,
      x: location.x,
      y: location.y,
      emoji: location.emoji,
    };
    LocationGeoList.push(point);
  }
  if (LocationGeoList.length == 0) {
    return null;
  }
  return LocationGeoList;
};

/**
 * @특정_장소_상세정보_조회
 */
const getLocationDetailById = async locationId => {
  const detail = await Location.findById(locationId);
  const reviews = await Review.find()
    .where("location")
    .equals(locationId)
    .sort({ created_at: -1 });

  let reviewList: IReviewOutputDTO[] = [];

  for (let review of reviews) {
    let user = await User.findById(review.user);
    let point: IReviewOutputDTO = {
      _id: review._id,
      user: user._id,
      nickname: user.nickname,
      title: review.title,
      content: review.content,
      emoji: review.emoji,
      created_at: review.created_at,
    };
    reviewList.push(point);
  }

  if (reviewList.length == 0) {
    return null;
  }
  if (!detail) {
    return null;
  }
  return { detail, reviewList };
};

/**
 * @장소_위치_저장
 */
const saveCoord = async (
  x,
  y,
  locationName,
  locationAddress,
  category,
  emoji
) => {
  try {
    const location = new Location({
      x: x,
      y: y,
      locationName: locationName,
      locationAddress: locationAddress,
      category: category,
      emoji: emoji,
    });

    await location.save();

    return location;
  } catch (error) {
    console.log(error.message);
    throw createError(rm.INTERNAL_SERVER_ERROR);
  }
};

/**
 * @장소_대표이모지_업데이트
 */
const updateLocationEmoji = async (emoji, locationId) => {
  await Location.findOneAndUpdate({ _id: locationId }, { emoji: emoji });
};

module.exports = {
  updateLocationEmoji,
  getAllLocationList,
  getLocationListByCategory,
  getLocationDetailById,
  saveCoord,
};
