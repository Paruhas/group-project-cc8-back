const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");

// const passport = require("../middlewares/passport");
// const auntMiddleware = passport.authenticate("jwt", { session: false });

router.get(
  "/topicId/:topicId",
  userController.protectUser,
  commentController.getAllCommentByTopicId
);
router.post("/", userController.protectUser, commentController.createComment);
router.patch("/:id", userController.protectUser, commentController.editComment);
router.delete(
  "/:id",
  userController.protectUser,
  commentController.deleteComment
);

module.exports = router;
