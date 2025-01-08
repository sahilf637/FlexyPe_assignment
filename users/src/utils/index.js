const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("./../config");

module.exports.generateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.hashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.validatePassword = async (
  enteredPassword,
  savedPassword,
  salt,
) => {
  return hashPassword(enteredPassword, salt) === savedPassword;
};

module.exports.generateSignature = async (payload) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "2d" });
};

module.exports.validateSignature = async (req) => {
  const signature = req.get("Authorization");

  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  }

  return false;
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
