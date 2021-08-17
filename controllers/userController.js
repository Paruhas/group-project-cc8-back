const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, sequelize } = require("../models");
const AppError = require("../utils/AppError");

const isEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

exports.register = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { username, email, password, confirmPassword, userImg, birthDate } =
      req.body;

    // validation
    if (!username || !username.trim()) {
      throw new AppError(400, "username is required");
    }
    if (!isEmail) {
      throw new AppError(400, "Email is required.");
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

    const checkedDuplicateUsername = await User.findOne({
      where: {
        username: username,
      },
    });
    if (checkedDuplicateUsername) {
      throw new AppError(400, "Username is duplicated");
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
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });

    await transaction.commit();
    res.status(201).json({ token });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const loginUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!loginUser)
      return res.status(400).json({ message: "email or password incorrect" });

    if (loginUser.userStatus === "INACTIVE")
      return res.status(400).json({ message: "This user was deleted." });
    if (loginUser.userStatus === "BANNED")
      return res.status(400).json({ message: "This user has been banned." });
    const isPasswordMatch = await bcrypt.compare(password, loginUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "email or password incorrect" });
    }

    const payload = {
      id: loginUser.id,
      username: loginUser.username,
      email: loginUser.email,
      userImg: loginUser.userImg,
      birthDate: loginUser.birthDate,
      userRole: loginUser.userRole,
      userStatus: loginUser.userStatus,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    return res.status(200).json({ token: token });
  } catch (err) {
    next(err);
  }
};

// อาาจะไม่ได้ใช้ ถ้าเราเปลี่ยนไปใช้ passport แทน
exports.protectAdmin = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return res.status(401).json({ message: "you are unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!user) return res.status(401).json({ message: "user not found" });

    if (user.userRole !== "ADMIN")
      return res.status(400).json({ message: "You are unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
exports.protectUser = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "you are unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!user) return res.status(401).json({ message: "user not found" });

    // if (user.userRole !== "USER")
    //   return res.status(400).json({ message: "You are unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { id, username, email, userImg, birthDate, userRole, userStatus } =
      req.user;
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
    const { oldPassword, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password is not match" });

    if (!oldPassword || !oldPassword.trim())
      return res.status(400).json({ message: "Old Password is required." });

    if (!password || !password.trim())
      return res.status(400).json({ message: "Password is required." });

    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ message: "User not found." });

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect Old Password",
      });
    }

    const isPassword = regexPassword.test(password);
    if (!isPassword)
      return res.status(400).json({
        message:
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter.",
      });

    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.BCRYPT_SALT
    );

    await User.update({ password: hashedPassword }, { where: { id } });
    res.status(200).json({ message: `Password is updated.` });
  } catch (err) {
    next(err);
  }
};
exports.deleteMe = async (req, res, next) => {
  try {
    const { id, userRole, userStatus } = req.user;
    if (userStatus === "INACTIVE")
      return res.status(400).json({ message: "This user has been deleted" });
    if (userRole === "ADMIN")
      return res.status(400).json({ message: "Cannot delelte admin." });

    await User.update({ userStatus: "INACTIVE" }, { where: { id } });
    res.status(200).json({ message: "This user is deleted successfully" });
  } catch (err) {
    next(err);
  }
};
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [["id", "DESC"]] });
    if (!users) return res.status(400).json({ message: "User not found" });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(400).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
exports.editUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userStatus } = req.body;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ message: "User not found." });
    if (user.userRole === "ADMIN")
      return res
        .status(400)
        .json({ message: "Cannot change status of admin." });
    await User.update({ userStatus: userStatus }, { where: { id } });
    res
      .status(200)
      .json({ message: `User status with ID ${id} is updated successfully.` });
  } catch (err) {
    next(err);
  }
};

exports.getLike = async (req, res, next) => {
  const { id } = req.body;
  const getLike = await User.findAndCountAll({ where: { userStatus: id } });
  res.status(200).json(getLike.count);
};
