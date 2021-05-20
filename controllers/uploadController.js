const { sequelize } = require("../models");

exports.uploadImage = async (req, res, next) => {
  try {
    // console.log(req, "app");
    // console.log(req.imgUrl, "app-Image");
    res.status(200).json({ img: req.imgUrl });
  } catch (err) {
    next(err);
  }
};

exports.uploadIcon100 = async (req, res, next) => {
  try {
    // console.log(req, "app");
    // console.log(req.imgUrl, "app-Image");
    res.status(200).json({ img: req.imgUrl });
  } catch (err) {
    next(err);
  }
};
