const express = require("express");
const router = express.Router();
const roomRoute = require("./roomRoute");
const likeRoute = require("./likeRoute");
const pinRoute = require("./pinRoute");
const topicRoute = require("./topicRoute");
const admin = require("../controllers/userController");
const topicController = require("../controllers/topicController");

router.get("/me");
router.patch("/me/update");
router.patch("/me/password");
router.patch("/me/delete");
router.get("/user");
router.get("/user/:id");
router.patch("/user/status/:id");

router.use("/rooms", roomRoute);
router.use("/topics", topicRoute);
router.use("/likes", likeRoute);
router.use("/pins", pinRoute);

router.get("/topics/inactive", topicController.getAllTopicsInactive);
router.get("/topics/inactive/:id", topicController.getTopicByIdInactive);
router.patch("/topics/active-inactive/:id", topicController.updateTopicStatus);

router.get("/report");
router.get("/report/:id");
router.post("/report/");
router.patch("/report/status/:id");

module.exports = router;
