const express = require("express");
const router = express.Router();
const roomRoute = require("./roomRoute");
const likeRoute = require("./likeRoute");
const pinRoute = require("./pinRoute");
const topicRoute = require("./topicRoute");

const passport = require("passport");
const protectMiddleware = passport.authenticate("jwt", { session: false });

router.get("/me");
router.patch("/me/update");
router.patch("/me/password");
router.get("/user/:id");

router.use("/rooms", roomRoute);
router.use("/topics", topicRoute);
router.use("/likes", likeRoute);
router.use("/pins", pinRoute);

router.post("/report/");

module.exports = router;
