import config from "../config";
import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcryptjs";

const createError = require("http-errors");
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
const date = require("../modules/date");
const getSchool = require("../modules/getSchool");
const generateNickname = require("../modules/nicknameGenerate");
const nickNameSet = require("../modules/nicknameSet");
const nodemailer = require("nodemailer");

/**
 * @자동_로그인
 */
const loginUser = async (email, password) => {};
// TODO . 최초 인증 시 자동 로그인 API 작성

/**
 * @토큰_생성
 */
const generateToken = async userId => {
  const token = jwt.sign({ sub: userId }, config.jwtSecret, {
    expiresIn: 864000,
  });

  return token;
};

/**
 * @회원_가입
 */
const signupUser = async (email, password) => {
  const isUsedEmail = await User.findOne({ email });
  if (isUsedEmail != null) {
    throw createError(sc.BAD_REQUEST, rm.ALREADY_EMAIL);
  }

  const nickname = generateNickname(nickNameSet);
  const school = getSchool(email);

  let created_at = date.getDate();
  const user = new User({
    email,
    nickname,
    password,
    school,
    created_at,
  });

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();
  return user;
};

/**
 * @이메일_인증
 */
const mailToUser = async email => {
  //   const user = await User.findOne({ email: email });
  //   if (user) {
  //     throw createError(sc.BAD_REQUEST, rm.ALREADY_EMAIL);
  //   } // DB, 자동로그인 완성 시 추가

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

  await transporter.sendMail({
    from: `"Test" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "Test 비밀번호 인증 메일입니다.",
    text: "앱으로 돌아가서 해당 인증코드를 입력해주세요 :)",
    html: `앱으로 돌아가서 해당 인증코드를 입력해주세요 :)</br> 인증코드는 <b>${verifyCode}</b> 입니다.`,
  });

  return verifyCode;
};

module.exports = {
  loginUser,
  signupUser,
  generateToken,
  mailToUser,
};
