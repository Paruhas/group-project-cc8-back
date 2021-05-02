const express = require("express");
const router = express.Router();

router.get("/");
router.get("/:id");
router.get("/latest-topic");
router.get("/hot-topic");
router.get("/room/:roomId");
router.get("/user/:userId");
router.post("/");
router.patch("/:id");
router.patch("/inactive/:id");

module.exports = router;
