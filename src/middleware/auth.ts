import jwt from "jsonwebtoken";
import config from "../config";
import createError from "http-errors";
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");
const { success, fail } = require("../modules/util");

export default (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.NO_TOKEN));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    res.locals.tokenValue = token;
    res.locals.userId = decoded.sub;
    next();
  } catch (err) {
    return res
      .status(sc.UNAUTHORIZED)
      .send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
  }
};
