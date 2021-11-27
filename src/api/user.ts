import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";

const router = express.Router();
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const { success, fail } = require("../modules/util");
const userService = require("../services/userService");
const reviewService = require("../services/reviewService");

/**
 *  @route Post users/login
 *  @desc 로그인
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
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));
    }

    const { email, password } = req.body;

    try {
      const user = await userService.getUserByEmail(email);
      if (!user)
        return res.status(sc.NO_USER).send(fail(sc.NO_USER, rm.NOT_USED_EMAIL));

      const login = await userService.loginUser(user, password);

      if (!login)
        return res
          .status(sc.UNAUTHORIZED)
          .send(fail(sc.UNAUTHORIZED, rm.INCORRECT_PASSWORD));

      const userToken = await userService.generateToken(user._id);
      const nickName = user.nickname;
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.SIGN_IN_SUCCESS, { nickName, userToken }));
    } catch (error) {
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(fail(sc.INTERNAL_SERVER_ERROR, rm.SERVER_ERROR));
    }
  }
);

/**
 *  @route Post users/signup
 *  @desc 회원 가입
 *  @access Public
 */
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
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));
    }

    const { email, password } = req.body;

    try {
      const user = await userService.getUserByEmail(email);
      if (user)
        return res
          .status(sc.ALREADY_USER)
          .send(fail(sc.ALREADY_USER, rm.ALREADY_EMAIL));

      const newUser = await userService.signupUser(email, password);
      const userToken = await userService.generateToken(newUser._id);

      return res.status(sc.CREATED).send(
        success(sc.CREATED, rm.SIGN_UP_SUCCESS, {
          user: newUser,
          token: userToken,
        })
      );
    } catch (error) {
      return next(error);
    }
  }
);

/**
 *  @route Post users/auth
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
      return res.status(sc.NULL_VALUE).send(fail(sc.NULL_VALUE, rm.NULL_VALUE));
    }

    const email = req.body.email;

    try {
      const user = await userService.getUserByEmail(email);
      if (user)
        return res
          .status(sc.ALREADY_USER)
          .send(fail(sc.ALREADY_USER, rm.ALREADY_EMAIL));

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
 *  @route GET users/
 *  @desc 마이페이지 ( 닉네임, 리뷰 목록 )
 */
router.get("/", auth, async (req: Request, res: Response, next) => {
  const userId = res.locals.userId;

  try {
    const user = await userService.getUserInfo(userId);
    const nickname = user.nickname;
    const reviews = await reviewService.getReviews(userId);
    const reviewCount = reviews.length;

    return res
      .status(sc.OK)
      .send(
        success(sc.OK, rm.MY_PAGE_SUCCESS, { nickname, reviewCount, reviews })
      );
  } catch (error) {
    return next(error);
  }
});

/**
 *  @route DELETE users/
 *  @desc 회원 탈퇴
 *  @access Public
 */
router.delete("/", async (req: Request, res: Response, next) => {
  const userId = res.locals.userId;

  try {
    const user = await userService.deleteUser(userId);

    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_USER_SUCCESS, user));
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.SERVER_ERROR));
  }
});

module.exports = router;
