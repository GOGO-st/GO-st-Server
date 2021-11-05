const schools = require("./schoolList");

const getSchool = email => {
  const eng = email.split("@")[1].split(".")[0];
  let kor;
  schools.forEach(school => {
    if (school.eng == eng) {
      kor = school.kor;
    }
  });
  return kor;
};

module.exports = getSchool;
