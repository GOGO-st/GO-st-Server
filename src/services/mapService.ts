import Location from "../models/Location";
import createError from "http-errors";
import { ILocationGeoDTO, ILocationSearchDTO } from "../interfaces/ILocation";
import mongoose from "mongoose";
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");

const getAllLocationList = async () => {
  var locations = await Location.find().select(
    "_id locationId latitude longitude"
  );

  let LocationGeoList: ILocationGeoDTO[] = [];

  for (let location of locations) {
    let point: ILocationGeoDTO = {
      _id: location._id,
      locationId: location.locationId,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    LocationGeoList.push(point);
  }
  if (LocationGeoList.length == 0) {
    return null;
  }
  return LocationGeoList;
};

const getLocationListByCategory = async category => {
  var locations = await Location.find({ category: category }).select(
    "_id locationId latitude longitude"
  );

  let LocationGeoList: ILocationGeoDTO[] = [];

  for (let location of locations) {
    let point: ILocationGeoDTO = {
      _id: location._id,
      locationId: location.locationId,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    LocationGeoList.push(point);
  }
  if (LocationGeoList.length == 0) {
    return null;
  }
  return LocationGeoList;
};

const getLocationDetailById = async locationId => {
  const detail = await Location.findById(locationId);

  if (!detail) {
    return null;
  }
  return detail;
};

const saveCoord = async location => {
  await location.save();
  return;
};

module.exports = {
  getAllLocationList,
  getLocationListByCategory,
  getLocationDetailById,
  saveCoord,
};