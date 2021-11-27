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
    from: `"GO.st" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "[GO.st] 인증 번호를 확인해주세요.",
    html: `
    <h3>안녕하세요, GO.st에서 인증용 번호가 도착했어요!</h3> 

    <p>이메일 인증을 완료해주세요. </p>

    <p>인증번호는 <b>${verifyCode}</b> 입니다.</p>

    <p>인증번호를 이메일 인증 화면에 입력해주세요.</p>

    <p>인증번호를 입력했는데도 계속 다음 화면으로 넘어가지 않는다면, 그래도 문제가 있다면 we.are.all.gost@gmail.com로 말씀해주세요.☺️</p>

    <p>본 메일은 발신 전용 메일로서 회신 되지 않습니다.</p>
    `,
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
