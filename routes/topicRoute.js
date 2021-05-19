const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");
const userController = require("../controllers/userController");

router.get("/mytopic", userController.protectUser, topicController.getMyTopic); //
router.get(
  "/user/:userId",
  userController.protectUser,
  topicController.getUserTopic
); //
router.get(
  "/latest-topics",
  userController.protectUser,
  topicController.getLastestTopics
); //

router.get(
  "/all-active",
  userController.protectUser,
  topicController.getAllActiveTopics
);
router.get(
  "/active/:id",
  userController.protectUser,
  topicController.getActiveTopicById
);
router.get(
  "/hot-topic",
  userController.protectUser,
  topicController.getHotTopicsActive
);

router.get(
  "/room/:roomId",
  userController.protectUser,
  topicController.getActiveTopicsByRoomId
);

router.post("/", userController.protectUser, topicController.createTopic); //
router.patch("/:id", userController.protectUser, topicController.updateTopic); //
router.patch(
  "/inactive/:id",
  userController.protectUser,
  topicController.updateTopicStatusByUser
); //

module.exports = router;
