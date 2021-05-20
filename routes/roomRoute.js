const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const userController = require("../controllers/userController");

router.get("/active", roomController.getAllActiveRooms); //
router.get("/active/:id", roomController.getActiveRoomById); //

module.exports = router;
