import School from "../models/School";

/**
 * @이메일_학교_파싱
 */
const getSchool = async email => {
  const eng = email.split("@")[1].split(".")[0];
  const school = await School.findOne({ eng });
  return school.kor;
};

module.exports = getSchool;
