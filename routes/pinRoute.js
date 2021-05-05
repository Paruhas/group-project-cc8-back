const express = require("express");
const router = express.Router();
const pinController = require("../controllers/pinController");

const passport = require("passport");
const auntMiddleware = passport.authenticate("jwt", { session: false });

router.get("/user/:userId", pinController.getAllPinActiveByUserId);
router.post("/", auntMiddleware, pinController.createPin);
router.delete("/:id", auntMiddleware, pinController.deletePin);

module.exports = router;
