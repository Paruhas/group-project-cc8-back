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

exports.getAllTopicsInactive = async (req, res, next) => {
  try {
    const topics = await Topic.findAll({
      where: {
        topicStatus: "INACTIVE",
      },
    });

    if (!topics) {
      return res.status(400).json({
        message: "topicsInactive not found ; or not have inactive status",
      });
    }

    res.status(200).json({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getTopicByIdInactive = async (req, res, next) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findOne({
      where: {
        id: id,
        topicStatus: "INACTIVE",
      },
    });

    if (!topic) {
      return res.status(400).json({
        message: "topicByIdInactive not found ; or not have inactive status",
      });
    }

    res.status(200).json({ topic });
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

exports.updateTopicStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topicStatus } = req.body;

    const topic = await Topic.findOne({
      where: { id },
    });

    if (!topic) {
      return res
        .status(400)
        .json({ message: "Topic > updateTopicStatus not found." });
    }

    const IsTopicHasThisStatus = await Topic.findOne({
      where: {
        id,
        topicStatus: topicStatus,
      },
    });

    if (IsTopicHasThisStatus) {
      return res.status(400).json({
        message:
          "Topic > can't update this topicStatus ; current topicStatus is same with req.body",
      });
    }

    await Topic.update(
      {
        topicStatus: topicStatus,
      },
      {
        where: {
          id,
        },
      }
    );

    res
      .status(200)
      .json({ message: `Topic id ${id}'s topicStatus updated successfully` });
  } catch (err) {
    if (err.name) {
      return res.status(500).json({
        message:
          "SequelizeDatabaseError: topicStatus's value must be 'ACTIVE' or 'INACTIVE'",
      });
    }
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

exports.getToppicByRoomId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getToppicByRoomId = await Topic.findAll({ where: { roomId: id } })
    res.status(200).json({ getToppicByRoomId });
  } catch (err) {
    next(err);
  }
};
exports.getRoomByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getToppicByUserId = await Topic.findAll({ where: { userId: id } })
    res.status(200).json({ getToppicByUserId });
  } catch (err) {
    
  }
}

exports.createToppic = async (req, res, next) => {
  try {
    const { topicName, topicContent, topicImg, roomId } = req.body;
    const newTopic = await Topic.create({
      topicName,
      topicContent,
      topicImg,
      topicStatus: "ACTIVE",
      roomId,
      userId:req.user.id
    });
    if (!topicName)
      return res.status(400).json({ message: "Topic name is required " });
    if (!topicContent)
      return res.status(400).json({ message: "Topic content name is required " });
    if (!roomId)
      return res.status(400).json({ message: "please tag roomid" });
     res.status(200).json({ newTopic });
  } catch (err) {
    next(err);
  }
}


