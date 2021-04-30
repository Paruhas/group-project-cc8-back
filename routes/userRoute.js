const express = require("express");
const router = express.Router();
const roomRoute = require("./roomRoute");
const likeRoute = require("./likeRoute");
const pinRoute = require("./pinRoute");
const topicRoute = require("./topicRoute");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, sequelize } = require("../models");
const AppError = require("../utils/AppError");

const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

exports.register = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      userImg,
      birthDate,
    } = req.body;

    // validation
    if (!username || !username.trim()) {
      throw new AppError(400, "username is required");
    }
    if (!isEmail.test(email)) {
      throw new AppError(400, "this email is invalid format");
    }
    if (!password || !password.trim()) {
      throw new AppError(400, "password is required");
    }
    if (!confirmPassword || !confirmPassword.trim()) {
      throw new AppError(400, "confirmPassword is required");
    }
    if (password !== confirmPassword) {
      throw new AppError(400, "password and confirmPassword not match");
    }
    if (!isPassword.test(password)) {
      throw new AppError(400, "this password is invalid format");
    }
    if (!userImg || !userImg.trim()) {
      throw new AppError(400, "userImg is required");
    }
    if (!birthDate || !birthDate.trim()) {
      throw new AppError(400, "birthDate is required");
    }

    const checkDuplicateEmail = await User.findOne({
      where: {
        email: email,
      },
    });
    if (checkDuplicateEmail) {
      throw new AppError(400, "this email have already taken");
    }

    const hashPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
    const newUser = await User.create(
      {
        username: username,
        email: email,
        password: hashPassword,
        userImg: userImg,
        birthDate: birthDate,
        userRole: "USER",
        userStatus: "ACTIVE",
      },
      {
        transaction: transaction,
      }
    );
    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      userImg: newUser.userImg,
      birthDate: newUser.birthDate,
      userRole: newUser.userRole,
      userStatus: newUser.userStatus,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });

    await transaction.commit();
    res.status(201).json({ token });
  } catch (err) {
    await transaction.rollback();
    next();
  }
};

router.get("/me");
router.patch("/me/update");
router.patch("/me/password");
router.get("/user/:id");

router.use("/rooms", roomRoute);
router.use("/topics", topicRoute);
router.use("/likes", likeRoute);
router.use("/pins", pinRoute);

router.post("/report/");

module.exports = router;
