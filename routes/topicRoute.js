const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");
const userController = require("../controllers/userController");

router.get("/", userController.protectUser, topicController.getAllTopicsActive);
router.get(
  "/by-id/:id",
  userController.protectUser,
  topicController.getTopicByIdActive
);
router.get(
  "/latest-topic",
  userController.protectUser,
  topicController.getLastedTopicsActive
);
router.get(
  "/hot-topic",
  userController.protectUser,
  topicController.getHotTopicsActive
);
router.get(
  "/room/:roomId",
  userController.protectUser,
  topicController.getToppicByRoomId
);
router.get(
  "/user/:userId",
  userController.protectUser,
  topicController.getRoomByUserId
);
router.post("/", userController.protectUser);
router.patch("/:id", userController.protectUser, topicController.updateTopic);
router.patch(
  "/inactive/:id",
  userController.protectUser,
  topicController.updateTopicStatus
);

module.exports = router;
