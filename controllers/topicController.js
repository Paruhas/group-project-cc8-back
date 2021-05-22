const {
  sequelize,
  Topic,
  Like,
  Room,
  Comment,
  User,
  Pin,
  Report,
} = require("../models");

// exports.getAllTopics = async (req, res, next) => {
//   try {
//     const topics = await Topic.findAll({
//       where: {},
//     });

//     if (!topics) {
//       return res.status(400).json({ message: "topics not found" });
//     }

//     res.status(200).json({ topics });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getActiveTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findOne({
      where: {
        id,
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "username", "userImg"] }],
        },
        {
          model: Like,
          include: [{ model: User, attributes: ["id", "userName", "userImg"] }],
        },
        Report,
        Pin,
      ],
    });

    if (!topic) {
      return res.status(400).json({ message: "topicById not found" });
    }

    res.status(200).json({ topic });
  } catch (err) {
    next(err);
  }
};

exports.getMyTopic = async (req, res, next) => {
  try {
    const { id } = req.user;

    const topics = await Topic.findAll({
      where: {
        userId: id,
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
        Comment,
        Like,
      ],
      attributes: ["id", "topicName", "createdAt"],
      order: [["created_at", "DESC"]],
    });

    if (!topics) {
      return res.status(400).json({ message: "Topic not found" });
    }

    const pin = await Pin.findAll({
      where: { userId: req.user.id },
      attributes: ["id", "topicId"],
    });

    res.status(200).json({ topics, pin });
  } catch (err) {
    next(err);
  }
};
exports.getActiveTopicsByRoomId = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { page } = req.query;

    // console.log(roomId);
    // console.log(page);

    const topics = await Topic.findAll({
      where: {
        roomId,
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { id: roomId, roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
        Comment,
        Like,
        Pin,
      ],
      attributes: ["id", "topicName", "createdAt"],
      offset: 10 * (page - 1),
      limit: 10,
      order: [["created_at", "DESC"]],
    });

    if (!topics) {
      return res.status(400).json({ message: "Topic not found" });
    }

    const pin = await Pin.findAll({
      where: req.user ? { userId: req.user.id } : {},
      attributes: ["id", "topicId"],
    });

    res.status(200).json({ topics, pin });
  } catch (err) {
    next(err);
  }
};

exports.getUserTopic = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const topics = await Topic.findAll({
      where: {
        userId,
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
        Comment,
        Like,
        Pin,
      ],
      attributes: ["id", "topicName", "topicContent", "createdAt"],
      order: [["created_at", "DESC"]],
    });

    if (!topics) {
      return res.status(400).json({ message: "Topic not found" });
    }
    const pin = await Pin.findAll({
      where: req.user ? { userId: req.user.id } : {},
      attributes: ["id", "topicId"],
    });

    res.status(200).json({ topics, pin });
  } catch (err) {
    next(err);
  }
};

exports.getLastestTopics = async (req, res, next) => {
  try {
    const lastestTopics = await Topic.findAll({
      where: {
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
        Comment,
        Like,
        Pin,
      ],
      attributes: ["id", "topicName", "createdAt"],
      limit: 4,
      order: [["created_at", "DESC"]],
    });

    if (!lastestTopics) {
      return res.status(400).json({
        message: "topicsLasted not found",
      });
    }
    const pin = await Pin.findAll({
      where: req.user ? { userId: req.user.id } : {},
      attributes: ["id", "topicId"],
    });

    res.status(200).json({ lastestTopics, pin });
  } catch (err) {
    next(err);
  }
};

exports.getAllActiveTopics = async (req, res, next) => {
  try {
    const { page } = req.query;
    const allTopics = await Topic.findAll({
      where: {
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
      ],
      attributes: ["id", "topicName", "createdAt"],
      order: [["created_at", "DESC"]],
    });
    const numberOfTopic = allTopics.length;
    const topics = await Topic.findAll({
      where: {
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
        Comment,
        Like,
        Pin,
      ],
      attributes: ["id", "topicName", "createdAt"],
      offset: 10 * ((page ? page : 1) - 1),
      limit: 10,
      order: [["created_at", "DESC"]],
    });

    if (!topics) {
      return res
        .status(400)
        .json({ message: "topics not found ; or not have active status" });
    }
    const pin = await Pin.findAll({
      where: req.user ? { userId: req.user.id } : {},
      attributes: ["id", "topicId"],
    });

    res.status(200).json({ topics, numberOfTopic, pin });
  } catch (err) {
    next(err);
  }
};

// exports.getTopicByIdActive = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const topic = await Topic.findOne({
//       where: {
//         id: id,
//         topicStatus: "ACTIVE",
//       },
//     });

//     if (!topic) {
//       return res
//         .status(400)
//         .json({ message: "topicById not found ; or not have active status" });
//     }

//     res.status(200).json({ topic });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getLastedTopicsActive = async (req, res, next) => {
//   try {
//     const topicsLasted = await Topic.findAll({
//       where: {
//         topicStatus: "ACTIVE",
//       },
//       limit: 4,
//       order: [["created_at", "DESC"]],
//     });

//     if (!topicsLasted) {
//       return res.status(400).json({
//         message: "topicsLasted not found ; or not have active status",
//       });
//     }

//     res.status(200).json({ topicsLasted });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getHotTopicsActive = async (req, res, next) => {
  try {
    const topics = await Topic.findAll({
      where: {
        topicStatus: "ACTIVE",
      },
      include: [
        {
          model: Room,
          where: { roomStatus: "ACTIVE" },
          attributes: ["id", "roomName", "roomIcon"],
        },
        {
          model: User,
          where: { userStatus: "ACTIVE" },
          attributes: ["id", "username", "userImg"],
        },
        Comment,
        Like,
        Pin,
      ],
      attributes: ["id", "topicName", "createdAt"],

      order: [["created_at", "DESC"]],
    });

    if (!topics.length)
      return res.status(400).json({ message: "Topic not found." });
    const parseTopics = JSON.parse(JSON.stringify(topics));
    const topicss = parseTopics.map((topic) => {
      const timenow = new Date().setHours(00, 00, 00);
      const timetoppicpost = new Date(topic.createdAt).setHours(00, 00, 00);

      const day = Math.floor((timenow - timetoppicpost) / 86400000) + 1;
      const score =
        (topic.Comments.length / day) * 65 + (topic.Likes.length / day) * 35;
      console.log(score);
      return { ...topic, score };
    });

    topicss.sort((a, b) => b.score - a.score);
    const pin = await Pin.findAll({
      where: req.user ? { userId: req.user.id } : {},
      attributes: ["id", "topicId"],
    });

    res.status(200).json({ topicss, pin });
  } catch (err) {
    next(err);
  }
};

exports.getAllTopicsForAdmin = async (req, res, next) => {
  try {
    const { page, topicStatus, roomStatus, userStatus } = req.query;

    // const objArr = [{ topicStatus }, { roomStatus }, { userStatus }]
    //   .filter((status) => Object.values(status)[0])
    //   .map((obj) => Object.entries(obj))
    //   .flat();
    // const obj = Object.fromEntries(objArr);
    // console.log("ARR", obj);

    const topics = await Topic.findAll({
      where: topicStatus ? { topicStatus } : {},
      include: [
        {
          model: Room,
          where: roomStatus ? { roomStatus } : {},
          attributes: ["id", "roomName", "roomIcon", "roomStatus"],
        },
        {
          model: User,
          where: userStatus ? { userStatus } : {},
          attributes: ["id", "username", "userImg", "userStatus"],
        },
        Comment,
        Like,
        Pin,
      ],
      attributes: ["id", "topicName", "createdAt", "topicStatus", "topicImg"],
      offset: 10 * ((page ? page : 1) - 1),
      limit: 10,
      order: [["id", "DESC"]],
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
exports.getTopicsByIdForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const topics = await Topic.findOne({
      where: { id },
      include: [
        {
          model: Room,

          attributes: ["id", "roomName", "roomIcon", "roomStatus"],
        },
        {
          model: User,

          attributes: ["id", "username", "userImg", "userStatus"],
        },
        Comment,
        Like,
        Pin,
      ],
      attributes: [
        "id",
        "topicName",
        "topicContent",
        "createdAt",
        "topicStatus",
      ],

      order: [["created_at", "DESC"]],
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

// exports.getTopicByIdInactive = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const topic = await Topic.findOne({
//       where: {
//         id: id,
//         topicStatus: "INACTIVE",
//       },
//     });

//     if (!topic) {
//       return res.status(400).json({
//         message: "topicByIdInactive not found ; or not have inactive status",
//       });
//     }

//     res.status(200).json({ topic });
//   } catch (err) {
//     next(err);
//   }
// };

exports.updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topicName, topicContent, topicImg, roomId } = req.body;

    const topic = await Topic.findOne({ where: { id } });
    if (!topic) return res.status(400).json({ message: "Topic not found." });
    if (topic.userId !== req.user.id)
      return res.status(400).json({ message: "Cannot edit other's topic." });
    if (roomId) {
      const room = await Room.findOne({ where: { id: roomId } });
      if (!room) return res.status(400).json({ message: "Room not found." });
    }
    await Topic.update(
      { topicName, topicContent, topicImg, roomId },
      { where: { id } }
    );
    res.status(201).json({ message: `Topic id ${id} is updated successfully` });
  } catch (err) {
    next(err);
  }
};

exports.updateTopicStatusByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topicStatus } = req.body;

    const topic = await Topic.findOne({
      where: { id },
    });

    if (!topic) {
      return res.status(400).json({ message: "Topic not found." });
    }

    const IsTopicHasThisStatus = await Topic.findOne({
      where: {
        id,
        topicStatus: topicStatus,
      },
    });

    if (IsTopicHasThisStatus) {
      return res.status(400).json({
        message: "Topic not change",
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
exports.updateTopicStatusByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topicStatus } = req.body;

    const topic = await Topic.findOne({
      where: { id, userId: req.user.id },
    });

    if (!topic) {
      return res.status(400).json({ message: "Topic not found." });
    }

    const IsTopicHasThisStatus = await Topic.findOne({
      where: {
        id,
        topicStatus: topicStatus,
      },
    });

    if (IsTopicHasThisStatus) {
      return res.status(400).json({
        message: "Topic not change",
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
// exports.deleteTopic = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const topic = await Topic.findAll({ where: { id } });
//     if (!topic) return res.status(400).json({ message: "Topic not found." });
//     if (+topic.userId !== +req.user.id)
//       ({ message: "Cannot delete other's topic." });
//     await Topic.update({ roomStatus: "INACTIVE" }, { where: { id } });
//     res.status(201).json({ message: `Topic id ${id} is deleted successfully` });
//   } catch (err) {
//     next(err);
//   }
// };
exports.getToppicByRoomId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getToppicByRoomId = await Topic.findAll({ where: { roomId: id } });
    res.status(200).json({ getToppicByRoomId });
  } catch (err) {
    next(err);
  }
};
exports.getRoomByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getToppicByUserId = await Topic.findAll({ where: { userId: id } });
    res.status(200).json({ getToppicByUserId });
  } catch (err) {}
};
exports.createTopic = async (req, res, next) => {
  try {
    const { topicName, topicContent, topicImg, roomId } = req.body;
    const newTopic = await Topic.create({
      topicName,
      topicContent,
      topicImg,
      roomId,
      userId: req.user.id,
    });
    if (!topicName)
      return res.status(400).json({ message: "Topic name is required " });

    if (!topicContent)
      return res
        .status(400)
        .json({ message: "Topic content name is required " });
    if (!roomId) return res.status(400).json({ message: "please tag roomId" });
    res.status(200).json({ newTopic });
  } catch (err) {
    next(err);
  }
};
