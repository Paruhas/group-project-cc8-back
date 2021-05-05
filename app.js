require("dotenv").config();
require("./middlewares/passport");
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models");
const errorMiddleware = require("./middlewares/error");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const roomRoute = require("./routes/roomRoute");
const topicRoute = require("./routes/topicRoute");
const pinRoute = require("./routes/pinRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// test upload SingleImage middleware "Multer"
const multer = require("./middlewares/multer");

app.post("/test-upload", multer.send, async (req, res, next) => {
  try {
    console.log(req, "app");
    console.log(req.imgUrl, "app-Image");
    res.status(200).json({ message: "test", img: req.imgUrl });
  } catch (err) {
    next(err);
  }
});

const userController = require("./controllers/userController");
app.post("/login", userController.login);
app.post("/register", userController.register);

app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/room", roomRoute);
app.use("/topic", topicRoute);
app.use("/pin", pinRoute);

app.use((req, res, next) => {
  try {
    res.status(400).json({ message: "Path not found." });
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

// sequelize.sync({ force: true }).then(() => console.log("DB Sync"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
