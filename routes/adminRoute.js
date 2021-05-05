const express = require("express");
const router = express.Router();
const roomRoute = require("./roomRoute");
const likeRoute = require("./likeRoute");
const pinRoute = require("./pinRoute");
const topicRoute = require("./topicRoute");
const reportController = require("../controllers/reportController");
const topicController = require("../controllers/topicController");
const userController = require("../controllers/userController");
const roomController = require("../controllers/roomController");

router.get("/me", userController.getMe);
router.patch("/me/update", userController.updateMe);
router.patch("/me/password", userController.editMyPassword);
router.patch("/me/delete", userController.deleteMe);
router.get("/user", userController.getAllUser);
router.get("/user/:id", userController.getUserById);
router.patch("/user/status/:id", userController.editUserStatus);

router.use("/rooms", roomRoute);
router.use("/topics", topicRoute);
router.use("/likes", likeRoute);
router.use("/pins", pinRoute);

router.get("/rooms/", roomController.getAllRooms);
router.get("/rooms/:id", roomController.getRoomById);
router.post("/", roomController.createRoom);
router.patch("/:id", roomController.updateRoom);

router.get("/topics/inactive", topicController.getAllTopicsInactive);
router.get("/topics/inactive/:id", topicController.getTopicByIdInactive);
router.patch("/topics/active-inactive/:id", topicController.updateTopicStatus);

router.get("/report", reportController.getAllReports);
router.get("/report/:id", reportController.getReportById);
router.post("/report/", reportController.createReport);
router.patch("/report/status/:id", reportController.updateReportStatus);

module.exports = router;
