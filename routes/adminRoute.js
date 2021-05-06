const express = require("express");
const router = express.Router();
const roomRoute = require("./roomRoute");
const likeRoute = require("./likeRoute");
const pinRoute = require("./pinRoute");
const topicRoute = require("./topicRoute");
const commentRoute = require("./commentRoute");
const reportController = require("../controllers/reportController");
const topicController = require("../controllers/topicController");
const userController = require("../controllers/userController");
const roomController = require("../controllers/roomController");

router.get("/me", userController.protectAdmin, userController.getMe);
router.patch(
  "/me/update",
  userController.protectAdmin,
  userController.updateMe
);
router.patch(
  "/me/password",
  userController.protectAdmin,
  userController.editMyPassword
);
router.patch(
  "/me/delete",
  userController.protectAdmin,
  userController.deleteMe
);
router.get("/user", userController.protectAdmin, userController.getAllUser);
router.get(
  "/user/:id",
  userController.protectAdmin,
  userController.getUserById
);
router.patch(
  "/user/status/:id",
  userController.protectAdmin,
  userController.editUserStatus
);

router.use("/rooms", roomRoute);
router.use("/topics", topicRoute);
router.use("/likes", likeRoute);
router.use("/pins", pinRoute);
router.use("/comments", commentRoute);

router.get("/rooms/", userController.protectAdmin, roomController.getAllRooms);
router.get(
  "/rooms/:id",
  userController.protectAdmin,
  roomController.getRoomById
);
router.post("/", userController.protectAdmin, roomController.createRoom);
router.patch("/:id", userController.protectAdmin, roomController.updateRoom);

router.get(
  "/topics/inactive",
  userController.protectAdmin,
  topicController.getAllTopicsInactive
);
router.get(
  "/topics/inactive/:id",
  userController.protectAdmin,
  topicController.getTopicByIdInactive
);
router.patch(
  "/topics/active-inactive/:id",
  userController.protectAdmin,
  topicController.updateTopicStatus
);

router.get(
  "/report",
  userController.protectAdmin,
  reportController.getAllReports
);
router.get(
  "/report/:id",
  userController.protectAdmin,
  reportController.getReportById
);
router.post(
  "/report/",
  userController.protectAdmin,
  reportController.createReport
);
router.patch(
  "/report/status/:id",
  userController.protectAdmin,
  reportController.updateReportStatus
);

module.exports = router;
