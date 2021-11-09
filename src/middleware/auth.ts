import jwt from "jsonwebtoken";
import config from "../config";
import createError from "http-errors";
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");

export default (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    next(createError(sc.BAD_REQUEST, rm.NO_TOKEN));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    res.locals.tokenValue = token;
    res.locals.userId = decoded.sub;
    next();
  } catch (err) {
    next(createError(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
  }
};
