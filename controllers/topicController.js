const { sequelize, Topic, Like } = require("../models");

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = await Topic.findAll({
      where: {},
    });

    if (!topics) {
      return res.status(400).json({ message: "topics not found" });
    }

    res.status(200).json({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findOne({
      where: {
        id: id,
      },
    });

    if (!topic) {
      return res.status(400).json({ message: "topicById not found" });
    }

    res.status(200).json({ topic });
  } catch (err) {
    next(err);
  }
};

exports.getLastedTopics = async (req, res, next) => {
  try {
    const topicsLasted = await Topic.findAll({
      where: {},
      limit: 4,
      order: [["created_at", "DESC"]],
    });

    if (!topicsLasted) {
      return res.status(400).json({
        message: "topicsLasted not found",
      });
    }

    res.status(200).json({ topicsLasted });
  } catch (err) {
    next(err);
  }
};

exports.getAllTopicsActive = async (req, res, next) => {
  try {
    const topics = await Topic.findAll({
      where: {
        topicStatus: "ACTIVE",
      },
    });

    if (!topics) {
      return res
        .status(400)
        .json({ message: "topics not found ; or not have active status" });
    }

    res.status(200).json({ topics });
  } catch (err) {
    next(err);
  }
};
exports.updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topicName, topicContent, topicImg, roomId } = req.body;

    const topic = await Topic.findOne({ where: { id } });
    if (!topic) return res.status(400).json({ message: "Topic not found." });
    if (+topic.userId !== +req.user.id)
      ({ message: "Cannot edit other's topic." });
    const room = await Room.findOne({ where: { id: roomId } });
    if (!room) return res.status(400).json({ message: "Room not found." });
    await Topic.update(
      { topicName, topicContent, topicImg, roomId },
      { where: { id } }
    );
    res.status(201).json({ message: `Topic id ${id} is updated successfully` });
  } catch (err) {
    next(err);
  }
};

exports.deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findAll({ where: { id } });
    if (!topic) return res.status(400).json({ message: "Topic not found." });
    if (+topic.userId !== +req.user.id)
      ({ message: "Cannot delete other's topic." });
    await Topic.update({ roomStatus: "INACTIVE" }, { where: { id } });
    res.status(201).json({ message: `Topic id ${id} is deleted successfully` });
  } catch (err) {
    next(err);
  }
};
exports.getTopicByIdActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findOne({
      where: {
        id: id,
        topicStatus: "ACTIVE",
      },
    });

    if (!topic) {
      return res
        .status(400)
        .json({ message: "topicById not found ; or not have active status" });
    }

    res.status(200).json({ topic });
  } catch (err) {
    next(err);
  }
};

exports.getLastedTopicsActive = async (req, res, next) => {
  try {
    const topicsLasted = await Topic.findAll({
      where: {
        topicStatus: "ACTIVE",
      },
      limit: 4,
      order: [["created_at", "DESC"]],
    });

    if (!topicsLasted) {
      return res.status(400).json({
        message: "topicsLasted not found ; or not have active status",
      });
    }

    res.status(200).json({ topicsLasted });
  } catch (err) {
    next(err);
  }
};

exports.getHotTopicsActive = async (req, res, next) => {
  try {
    const topicsHot = await Like.findAll({
      include: [
        {
          model: Topic,
          attributes: [],
          where: {
            topicStatus: "ACTIVE",
          },
        },
      ],
      attributes: [
        "topic_id",
        [sequelize.fn("COUNT", "topic_id"), "totalLikes"],
      ],
      group: ["topic_id"],
      order: [[sequelize.literal("totalLikes"), "DESC"]],
      limit: 4,
    });

    if (!topicsHot) {
      return res.status(400).json({
        message: "topicsHot not found ; or not have active status",
      });
    }

    res.status(200).json({ topicsHot });
  } catch (err) {
    next(err);
  }
};


