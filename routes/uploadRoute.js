const express = require("express");
const router = express.Router();

const multer = require("../middlewares/multer");
const uploadController = require("../controllers/uploadController");

router.post("/user-img", multer.send, uploadController.uploadUserImage);
router.post("/room-img", multer.roomIconSend, uploadController.uploadRoomIcon);

module.exports = router;
