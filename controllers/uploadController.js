const { sequelize } = require("../models");

exports.uploadUserImage = async (req, res, next) => {
  try {
    // console.log(req, "app");
    // console.log(req.imgUrl, "app-Image");
    res.status(200).json({ img: req.imgUrl });
  } catch (err) {
    next(err);
  }
};

exports.uploadRoomIcon = async (req, res, next) => {
  try {
    // console.log(req, "app");
    // console.log(req.imgUrl, "app-Image");
    res.status(200).json({ img: req.imgUrl });
  } catch (err) {
    next(err);
  }
};
