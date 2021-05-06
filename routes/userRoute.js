const express = require("express");
const router = express.Router();
const roomRoute = require("./roomRoute");
const likeRoute = require("./likeRoute");
const pinRoute = require("./pinRoute");
const topicRoute = require("./topicRoute");
const commentRoute = require("./commentRoute");
const reportController = require("../controllers/reportController");
const userController = require("../controllers/userController");

// const passport = require("passport");
// const protectMiddleware = passport.authenticate("jwt", { session: false });

router.get("/me", userController.protectUser, userController.getMe);
router.patch("/me/update", userController.protectUser, userController.updateMe);
router.patch(
  "/me/password",
  userController.protectUser,
  userController.editMyPassword
);
router.get("/user/:id", userController.protectUser, userController.getUserById);

router.use("/rooms", roomRoute);
router.use("/topics", topicRoute);
router.use("/likes", likeRoute);
router.use("/pins", pinRoute);
router.use("/comments", commentRoute);

router.post(
  "/report/",
  userController.protectUser,
  reportController.createReport
);

module.exports = router;
