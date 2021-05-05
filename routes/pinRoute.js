const express = require("express");
const router = express.Router();
const pinController = require("../controllers/pinController");
const userController = require("../controllers/userController");

// const passport = require("../middlewares/passport");
// const auntMiddleware = passport.authenticate("jwt", { session: false });

router.get(
  "/user/:userId",
  userController.protectUser,
  pinController.getAllPinActiveByUserId
);
router.post("/", userController.protectUser, pinController.createPin);
router.delete("/:id", userController.protectUser, pinController.deletePin);

module.exports = router;
