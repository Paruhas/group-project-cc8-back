const express = require("express");
const router = express.Router();

router.get("/topic/:topicId");
router.post("/");
router.delete("/:id");

module.exports = router;
