import createError from "http-errors";
import express, { Request, Response } from "express";
import auth from "../middleware/auth";

const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const geoService = require("../services/geoService");
const searchService = require("../services/searchService");
const { success, fail } = require("../modules/util");

/**
 * @route GET geo/address?address={}
 * @desc 주소를 좌표로 변환합니다.
 */
router.get("/address", auth, async (req: Request, res: Response, next) => {
  const address = req.query.address;

  try {
    if (!address)
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));

    const coord = await geoService.requestGeocoding(address);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_LOCATION_SUCCESS, coord));
  } catch (error) {
    if (error.response.status)
      return next(createError(error.response.status, error.message));
    return next(createError(error));
  }
});

/**
 *  @route GET geo/coord?x={}?y={}
 *  @desc 좌표를 주소로 변환합니다.
 */
router.get("/coord", auth, async (req: Request, res: Response, next) => {
  const { x, y } = req.query;

  try {
    if (!x || !y)
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));

    const address = await geoService.requestLocation(x, y);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_LOCATION_SUCCESS, address));
  } catch (error) {
    if (error) return next(createError(error.message));
    return next(createError(error));
  }
});

/**
 * @route GET geo/search?keyword={}
 * @desc 장소를 검색합니다.
 */
router.get("/search", auth, async (req: Request, res: Response, next) => {
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
