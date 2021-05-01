const { User, sequelize } = require("../models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getMe = async (req, res, next) => {
  try {
    const {
      id,
      username,
      email,
      userImg,
      birthDate,
      userRole,
      userStatus,
    } = req.user;
    if (userStatus === "INACTIVE")
      return res.status(400).json({ message: "This user has been deleted" });
    res.status(200).json({
      id,
      username,
      email,
      userImg,
      birthDate,
      userRole,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateMe = async (req, res, next) => {
  try {
    const { id, userStatus } = req.user;
    const { username, email, userImg } = req.body;
    if (userStatus === "INACTIVE")
      return res.status(400).json({ message: "This user has been deleted" });

    const checkedDuplicateUsername = await User.findOne({
      where: { username },
    });
    if (checkedDuplicateUsername)
      return res.status(400).json({ message: "Username is duplicated" });
    const checkedDuplicateEmail = await User.findOne({ where: { email } });
    if (checkedDuplicateEmail)
      return res.status(400).json({ message: "Email is duplicated" });

    await User.update({ username, email, userImg }, { where: { id } });
    const newUser = await User.findOne({ where: { id } });
    const payload = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      userImg: newUser.userImg,
      birthDate: newUser.birthDate,
      userRole: newUser.userRole,
      userStatus: newUser.userStatus,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
exports.editMyPassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "Password is not match" });

    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    const isPassword = regexPassword.test(String(newPassword));
    if (!isPassword)
      return res.status(400).json({
        message:
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter.",
      });

    const hashedPassword = await bcrypt.hash(
      newPassword,
      +process.env.BCRYPT_SALT
    );

    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ message: "User not found." });
    await User.update({ password: hashedPassword }, { where: { id } });
    res.status(200).json({ message: `Password is updated.` });
  } catch (err) {
    next(err);
  }
};
exports.deleteMe = async (req, res, next) => {
  try {
    const { id, userStatus } = req.user;
    if (userStatus === "INACTIVE")
      return res.status(400).json({ message: "This user has been deleted" });

    await User.update({ userStatus: "INACTIVE" }, { where: { id } });
    res.status(200).json({ message: "This user is deleted successfully" });
  } catch (err) {
    next(err);
  }
};
