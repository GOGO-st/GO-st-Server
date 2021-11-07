import createError from "http-errors";
import mongoose from "mongoose";
import Location from "../models/Location";
import express, { Request, Response } from "express";
import axios from "axios";
const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const geoService = require("../services/geoService");
const searchService = require("../services/searchService");
const { success, fail } = require("../modules/util");

/**
 * @route GET geo/address
 * @desc 주소를 좌표로 변환합니다.
 * @access Public
 */
router.get("/", async (req: Request, res: Response, next) => {
  const location = req.query.location;
  try {
    if (!location)
      return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CONTENT));

    await geoService.requestGeocoding(location);
  } catch (error) {
    if (error.response.status)
      return next(createError(error.response.status, error.message));
    return next(createError(error));
  }
});

/**
 *  @route GET geo/coord
 *  @desc 좌표를 주소로 변환합니다.
 *  @access Public
 */
router.get("/coord", async (req: Request, res: Response, next) => {
  const { x, y } = req.query;
  const location = x + "," + y;
  try {
    if (!x || !y)
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));

    const address = await geoService.requestLocation(location);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_LOCATION_SUCCESS, address));
  } catch (error) {
    if (error.response.status)
      return next(createError(error.response.status, error.message));
    return next(createError(error));
  }
});

/**
 * @route GET geo/search
 */
router.get("/search", async (req: Request, res: Response, next) => {
  const keyword = req.query.keyword;
  try {
    if (!keyword)
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));

    const searchedList = await searchService.searchLocation(keyword);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.SEARCH_SUCCESS, searchedList));
  } catch (error) {
    return next(createError(error));
  }
});

module.exports = router;
