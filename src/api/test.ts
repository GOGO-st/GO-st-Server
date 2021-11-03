import createError from "http-errors";
import express, { Request, Response } from "express";
const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const { success, fail } = require("../modules/util");
import config from "../config";

router.get("/", async (req: Request, res: Response) => {
  const message = "Testing message";
  res.status(sc.OK).send(success(sc.OK, rm.OK, message));
});

module.exports = router;
