const { Topic } = require("../models");

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
