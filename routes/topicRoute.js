const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");
const userController = require("../controllers/userController")

router.get("/", topicController.getAllTopicsActive);
router.get("/by-id/:id", topicController.getTopicByIdActive);
router.get("/latest-topic", topicController.getLastedTopicsActive);
router.get("/hot-topic", topicController.getHotTopicsActive);
router.get("/room/:roomId",topicController.getToppicByRoomId);
router.get("/user/:userId", topicController.getRoomByUserId);
router.post("/",userController.protectUser,topicController.createToppic);
router.patch("/:id");
router.patch("/inactive/:id");

module.exports = router;
