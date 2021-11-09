import axios from "axios";
import createError from "http-errors";
import mongoose from "mongoose";
import { nextTick } from "process";
import config from "../config";
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");
const { getAddress } = require("../modules/getLocation");
const NAVER_MAP_URL =
  "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";

// 좌표로 주소 get
const requestLocation = async (x, y) => {
  const NAVER_REVERSE_URL = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${x},${y}&output=json&orders=roadaddr`;
  const coord = await axios.get(NAVER_REVERSE_URL, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": config.mapClientId,
      "X-NCP-APIGW-API-KEY": config.mapSecretKey,
    },
  });

  if (!coord.data.results) return null;

  const locationInfo = coord.data.results[0];
  return getAddress(locationInfo);
};

// 주소로 좌표 get
const requestGeocoding = async address => {
  const coord = await axios.get(NAVER_MAP_URL, {
    params: {
      query: address,
    },
    headers: {
      "X-NCP-APIGW-API-KEY-ID": config.mapClientId,
      "X-NCP-APIGW-API-KEY": config.mapSecretKey,
    },
  });

  //   if (!coord.data.addresses) return null;
  const x = coord.data.addresses[0].x;
  const y = coord.data.addresses[0].y;

  return { x, y };
};

module.exports = {
  requestGeocoding,
  requestLocation,
};
