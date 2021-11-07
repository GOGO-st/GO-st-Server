import createError from "http-errors";
import express, { Request, Response } from "express";
import config from "../config";
import { check, validationResult } from "express-validator";

const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const { success, fail } = require("../modules/util");
const userService = require("../services/userService");

/**
 *  @route Post user/login
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post(
  "/login",
  [
    check("email", "Please include a valid email").not().isEmpty(),
    check("password", "password is required").not().isEmpty(),
  ],
  async (req: Request, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    const { email, password } = req.body;

    try {
      const user = await userService.loginUser(email, password);
      const userToken = await userService.generateToken(user._id);
      const nickName = user.nickname;
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.SIGN_IN_SUCCESS, { nickName, userToken }));
    } catch (error) {
      return next(error);
    }
  }
);

/**
 *  @route Post user/signup
 *  @desc 이메일 인증 성공 시 user 데이터 생성 (회원가입)
 *  @access Public
 */
//TODO. 비밀번호 로직 작성하기
router.post(
  "/signup",
  [
    check("email", "email is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "password is required").not().isEmpty(),
  ],
  async (req: Request, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    const { email, password } = req.body;

    try {
      const user = await userService.signupUser(email, password);
      const userToken = await userService.generateToken(user._id);

      return res.status(sc.CREATED).send(
        success(sc.CREATED, rm.SIGN_UP_SUCCESS, {
          user: user,
          token: userToken,
        })
      );
    } catch (error) {
      return next(error);
    }
  }
);

/**
 *  @route Post user/auth
 *  @desc 이메일 인증 번호 전송 및 클라이언트 인증 번호 리턴
 *  @access Public
 */
router.post(
  "/auth",
  [
    check("email", "email is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],
  async (req: Request, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    const email = req.body.email;

    try {
      const authNum = await userService.mailToUser(email);
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.MAIL_SEND_SUCCESS, authNum));
    } catch (error) {
      return next(error);
    }
  }
);

/**
 *  @route Get user/myInfo
 *  @desc 마이페이지 ( 닉네임, 리뷰 목록 )
 */
// TODO. 마이페이지 작성하기

module.exports = router;
