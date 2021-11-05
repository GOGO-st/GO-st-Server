import createError from "http-errors";
import mongoose from "mongoose";
import Location from "../models/Location";
import express, { Request, Response } from "express";
import axios from "axios";
const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const locationService = require("../services/locationService");
const geoService = require("../services/geoService");
const { success, fail } = require("../modules/util");

router.put("/", async (req: Request, res: Response, next) => {
  const locationId = req.query.locationId;

  try {
    var locations = [];

    if (locationId) {
      const location = await locationService.getLocationDetailById(locationId);
      locations.push(location);
    } else {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    //좌표가 없는 카페가 없다.
    var cnt = 0;
    if (!locations)
      return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CONTENT));

    for (let location of locations) {
      const address = location.address;
      if (!address) return next(createError(400, "주소가 비어있습니다."));
      const coord = await geoService.requestGeocoding(address);
      if (!coord) return next(createError(400, "좌표 변환에 실패했습니다."));

      location.latitude = coord.y;
      location.longitude = coord.x;

      await locationService.saveCoord(location);
      cnt++;
    }

    return res.status(sc.OK).json({ message: `${cnt}개의 좌표 전환 성공` });
  } catch (error) {
    if (error.response.status)
      return next(createError(error.response.status, error.message));
    return next(createError(error));
  }
});

module.exports = router;
