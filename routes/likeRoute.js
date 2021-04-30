const express = require("express");
const router = express.Router();

router.get("/topic/:id");
router.get("/:id");
router.post("/");
router.delete("/:id");

module.exports = router;
