import config from "../config";
import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcryptjs";

const date = require("../modules/date");
const getSchool = require("../modules/getSchool");
const generateNickname = require("../modules/nicknameGenerate");
const nickNameSet = require("../modules/nicknameSet");
const nodemailer = require("nodemailer");

/**
 * @로그인
 */
const loginUser = async (user, password) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;
  return user;
};

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
  const nickname = generateNickname(nickNameSet);
  const school = await getSchool(email);

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
    html: `<h3>앱으로 돌아가서 해당 인증코드를 입력해주세요 :)</h3><p> 인증코드는 <b>${verifyCode}</b> 입니다.</p>`,
  });

  return verifyCode;
};

/**
 * @유저_정보_조회
 */
const getUserInfo = async userId => {
  const user = await User.find().where("_id").equals(userId).select("nickname");
  return user[0];
};

/**
 * @유저_정보_조회_By_Email
 */
const getUserByEmail = async email => {
  const user = await User.findOne({ email: email });

  if (!user) null;
  return user;
};

/**
 * @유저_탈퇴
 */
const deleteUser = async userId => {
  const deletedUser = await User.findOneAndRemove({ userId });
  return deletedUser;
};

module.exports = {
  loginUser,
  signupUser,
  generateToken,
  mailToUser,
  getUserInfo,
  getUserByEmail,
  deleteUser,
};
