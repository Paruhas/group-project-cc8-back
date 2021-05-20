const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");
const userController = require("../controllers/userController");

router.get("/mytopic", userController.protectUser, topicController.getMyTopic); //
router.get(
  "/user/:userId",

  topicController.getUserTopic
); //
router.get(
  "/latest-topics",

  topicController.getLastestTopics
); //

router.get(
  "/all-active",

  topicController.getAllActiveTopics
);
router.get(
  "/active/:id",

  topicController.getActiveTopicById
);
router.get(
  "/hot-topics",

  topicController.getHotTopicsActive
);

router.get(
  "/room/:roomId",

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
