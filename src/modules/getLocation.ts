const getLocation = data => {
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
    let t = data[i]["title"].replace(/<b>/gi, "").replace(/<\/b>/gi, "");
    titleList.push(t);
  }

  return titleList;
};

module.exports = { getLocation, getSearchedLocationTitle };
