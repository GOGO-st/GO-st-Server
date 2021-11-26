import createError from "http-errors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth";

const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const mapService = require("../services/mapService");
const { success, fail } = require("../modules/util");

/**
 *  @route GET maps/
 *  @desc 모든 장소를 리턴
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response, next) => {
  try {
    const locationList = await mapService.getAllLocationList();
    if (!locationList)
      return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CONTENT));

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.LOCATE_SUCCESS, locationList));
  } catch (error) {
    return next(error);
  }
});

/**
 *  @route GET maps/category
 *  @desc 카테고리 필터링 장소 리턴
 *  @access Public
 */
router.get("/category", auth, async (req: Request, res: Response, next) => {
  const category = req.query.category;

  if (!category) {
    return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));
  }

  try {
    const locationList = await mapService.getLocationListByCategory(category);

    if (!locationList)
      return res
        .status(sc.NO_CONTENT)
        .send(fail(sc.NO_CONTENT, rm.LOCATE_FAIL));

    return res
      .status(sc.OK)
      .send(success(sc.LOCATE_SUCCESS, rm.LOCATE_SUCCESS, locationList));
  } catch (error) {
    next(error);
  }
});

/**
 *  @route GET maps/detail/:locationId
 *  @desc 특정 장소 상세 정보 리턴
 *  @access Public
 */
router.get(
  "/detail/:locationId",
  auth,
  async (req: Request, res: Response, next) => {
    const { locationId } = req.params;
    if (!locationId)
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));

    try {
      if (!mongoose.isValidObjectId(locationId)) {
        return res
          .status(sc.NULL_VALUE)
          .send(fail(sc.NULL_VALUE, rm.NULL_VALUE));
      } else {
        const locationDetail = await mapService.getLocationDetailById(
          locationId
        );
        if (!locationDetail)
          return res
            .status(sc.NO_CONTENT)
            .send(fail(sc.NO_CONTENT, rm.LOCATE_DETAIL_FAIL));

        return res
          .status(sc.OK)
          .send(success(sc.OK, rm.LOCATE_DETAIL_SUCCESS, locationDetail));
      }
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
