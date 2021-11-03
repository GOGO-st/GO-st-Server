import createError from "http-errors";
import express, { Request, Response } from "express";
const router = express.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
import config from "../config";

router.get("/", async (req: Request, res: Response) => {
  const message = "Testing message";
  res.send(message);
});

module.exports = router;
