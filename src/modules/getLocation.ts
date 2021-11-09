const gs = require("../services/geoService");

const getAddress = data => {
  let region = "";
  let land = "";

  // region
  for (let i = 1; i < 5; i++) {
    region += data["region"][`area${i}`]["name"];
    if (i < 4) region += " ";
  }

  // land
  land += data["land"]["name"] + " " + data["land"]["number1"];

  let address = region + land;
  return address;
};

const getSearchedLocationTitle = data => {
  let titleList = [];

  for (let i = 0; i < data.length; i++) {
    let title = data[i]["title"].replace(/<b>/gi, "").replace(/<\/b>/gi, "");
    let address = data[i]["roadAddress"];
    titleList.push({ name: title, address: address });
  }

  return titleList;
};

module.exports = { getAddress, getSearchedLocationTitle };
