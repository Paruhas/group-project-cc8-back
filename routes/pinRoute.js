const express = require("express");
const router = express.Router();

router.get("/user/:userId");

router.post("/");
router.delete("/:id");

module.exports = router;
