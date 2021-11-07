import axios from "axios";
import createError from "http-errors";
import mongoose from "mongoose";
import { nextTick } from "process";
import config from "../config";

const { getSearchedLocationTitle } = require("../modules/getLocation");
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");

const searchLocation = async keyword => {
  const NAVERURL = `https://openapi.naver.com/v1/search/local.json?query=${encodeURI(
    keyword
  )}&display=10`;
  const result = await axios.get(NAVERURL, {
    headers: {
      "X-Naver-Client-Id": config.searchClientId,
      "X-Naver-Client-Secret": config.searchSecretKey,
    },
  });

  if (result.data.items.length == 0) return null;
  return getSearchedLocationTitle(result.data.items);
};

module.exports = {
  searchLocation,
};
