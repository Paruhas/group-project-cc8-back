const express = require("express");
const router = express.Router();

const multer = require("../middlewares/multer");
const uploadController = require("../controllers/uploadController");

router.post("/user-img", multer.send, uploadController.uploadUserImage);
router.post("/icon-img", multer.iconImg100, uploadController.uploadIcon100);

module.exports = router;
