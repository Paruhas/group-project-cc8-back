const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const userController = require("../controllers/userController");

router.get(
  "/active",
  userController.protectUser,
  roomController.getAllActiveRooms
); //
router.get(
  "/active/:id",
  userController.protectUser,
  roomController.getActiveRoomById
); //

module.exports = router;
