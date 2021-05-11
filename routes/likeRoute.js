const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const likeController = require("../controllers/likeController")

router.get("/topic/:topicId",likeController.getLike);
router.post("/",userController.protectUser,likeController.createLike);
router.delete("/:id",userController.protectUser,likeController.deleteLike);

module.exports = router;
