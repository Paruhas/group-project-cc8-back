const { sequelize, Pin, Topic, User } = require("../models");
const AppError = require("../utils/AppError");

// router.get("/user/:userId");
// router.post("/");
// router.delete("/:id");

exports.getAllPinActiveByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const findUser = await User.findByPk(userId);

    if (!findUser) {
      return res.status(400).json({ message: "no UserId in database" });
    }

    const pinned = await Pin.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Topic,
          where: {
            topicStatus: "ACTIVE",
          },
          attributes: ["id", "topicName"],
          include: [
            {
              model: User,
              where: { userStatus: "ACTIVE" },
            },
          ],
        },
      ],
    });

    res.status(200).json({ pinned });
  } catch (err) {
    next(err);
  }
};

exports.createPin = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { topicId } = req.body;
    const user = req.user;

    const findTopic = await Topic.findOne({
      where: {
        id: topicId,
        topicStatus: "ACTIVE",
      },
    });
    if (!findTopic) {
      throw new AppError(
        400,
        "topicById not found ; or not have active status"
      );
    }

    const findPinned = await Pin.findOne({
      where: {
        userId: user.id,
        topicId: topicId,
      },
    });
    if (findPinned) {
      throw new AppError(
        400,
        "can't Pin Topic : this UserId already Pin this TopicId"
      );
    }

    const newPin = await Pin.create(
      {
        userId: user.id,
        topicId: topicId,
      },
      {
        transaction: transaction,
      }
    );

    await transaction.commit();
    res.status(201).json({ newPin });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

exports.deletePin = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const user = req.user;

    const findPinned = await Pin.findOne({
      where: {
        id: id,
        userId: user.id,
      },
    });
    if (!findPinned) {
      throw new AppError(
        400,
        "can't delete this Pin Id : Pin don't belong to this userId or Pin Id not found"
      );
    }

    // throw new AppError(999, "test");

    const deletePin = await Pin.destroy(
      {
        where: {
          id: id,
          userId: user.id,
        },
      },
      {
        transaction: transaction,
      }
    );

    if (!deletePin) {
      throw new AppError(400, "no Pin has been deleted");
    }

    await transaction.commit();
    res.status(201).json({
      message: `Pin id ${findPinned.id} completed deleted`,
      deletedPin: findPinned,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
