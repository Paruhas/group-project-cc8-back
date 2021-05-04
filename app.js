require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models");
const errorMiddleware = require("./middlewares/error");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const roomRoute = require("./routes/roomRoute");
const topicRoute = require("./routes/topicRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// test Multer
const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const AppError = require("./utils/AppError");
const { User } = require("./models");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, "userProfile-" + Date.now() + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] === "jpeg" ||
      file.mimetype.split("/")[1] === "jpg" ||
      file.mimetype.split("/")[1] === "png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("this file is not a photo"));
    }
  },
});

app.post("/test", upload.single("userImg"), async (req, res, next) => {
  // console.log(req.file.path)
  // const { path } = req.file
  // console.log(path)
  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    // console.log(result)
    if (err) return next(err);
    const transaction = await sequelize.transaction();
    try {
      const {
        username,
        email,
        password,
        confirmPassword,
        // userImg,
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
      // if (!userImg || !userImg.trim()) {
      //   throw new AppError(400, "userImg is required");
      // }
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

      const hashPassword = await bcrypt.hash(
        password,
        +process.env.BCRYPT_SALT
      );
      const newUser = await User.create(
        {
          username: req.body.username,
          email: req.body.email,
          password: hashPassword,
          userImg: result.secure_url,
          birthDate: req.body.birthDate,
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

      fs.unlinkSync(req.file.path);
      await transaction.commit();
      res.status(201).json({ message: "TEST", newUser, token });
    } catch (err) {
      await transaction.rollback();
      fs.unlinkSync(req.file.path);
      next(err);
    }
  });
});

const userController = require("./controllers/userController");
app.post("/login", userController.login);
app.post("/register", userController.register);

app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/room", roomRoute);
app.use("/topic", topicRoute);

app.use((req, res, next) => {
  res.status(400).json({ message: "Path not found." });
});

app.use(errorMiddleware);

// sequelize.sync({ force: true }).then(() => console.log("DB Sync"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
