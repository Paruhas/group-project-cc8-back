const { sequelize, Comment, Topic, User } = require("../models");
const AppError = require("../utils/AppError");

// router.get("/user/:userId");
// router.post("/");
// router.delete("/:id");

exports.getAllCommentByTopicId = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const findTopic = await Topic.findByPk(topicId);

    if (!findTopic) {
      return res.status(400).json({ message: "no topicId in database" });
    }

    const comments = await Comment.findAll({
      where: {
        topicId,
      },
      include: [
        {
          model: Topic,
          where: {
            topicStatus: "ACTIVE",
          },
        },
        {
          model: User,
          where: {
            userStatus: "ACTIVE",
          },
        },
        {
          model: Room,
          where: {
            roomStatus: "ACTIVE",
          },
        },
      ],
      order: [["created_at", "ASC"]],
    });

    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { topicId, commentContent } = req.body;
    const user = req.user;

    const findTopic = await Topic.findOne({
      where: {
        [Op.and]: [{ id: topicId }, { topicStatus: "ACTIVE" }],
      },
    });
    if (!findTopic) {
      throw new AppError(
        400,
        "topicById not found ; or not have active status"
      );
    }

    await Comment.create(
      {
        commentContent,
        userId: user.id,
        topicId: topicId,
      },
      {
        transaction: transaction,
      }
    );

    await transaction.commit();
    res
      .status(201)
      .json({ message: `Comment is updated at topic id ${topicId}` });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
exports.editComment = async (req, res, next) => {
  const { id } = req.params;
  const { topicId, commentContent } = req.body;
  const topic = await Topic.findOne({
    where: {
      [Op.and]: [{ id: topicId }, { topicStatus: "ACTIVE" }],
    },
  });
  if (!topic) {
    throw new AppError(400, "topicById not found ; or not have active status");
  }
  if (req.user.id !== topic.userId)
    throw new AppError(400, "cannot delete other user's comment");
  await Topic.update({ commentContent }, { where: { id } });
  res
    .status(201)
    .json({ message: `Comment is created at topic id ${topicId}` });
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const comment = await Comment.findOne({
      where: {
        id: id,
        userId: user.id,
      },
    });
    if (!comment) {
      throw new AppError(
        400,
        "can't delete this comment Id : comment doesn't belong to this userId or comment Id not found"
      );
    }

    // throw new AppError(999, "test");

    await Comment.destroy({
      where: {
        id,
      },
    });

    res.status(204).json({
      message: "Comment is deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
