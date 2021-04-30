const express = require("express");
const router = express.Router();

router.get("/user/:id");
router.get("/:id");
router.post("/");
router.delete("/:id");

module.exports = router;
