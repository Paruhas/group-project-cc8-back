const express = require("express");
const router = express.Router();

const multer = require("../middlewares/multer");
const uploadController = require("../controllers/uploadController");

router.post("/user-img", multer.send, uploadController.uploadUserImage);

module.exports = router;
