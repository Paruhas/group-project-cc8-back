const { sequelize, Like, Topic, User } = require("../models");

exports.createLike = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findOne({ where: { id: topicId } });
    if (!topic) return res.status(400).json({ message: "Topic not found." });

    const previousLike = await Like.findOne({
      where: { topicId, userId: req.user.id },
    });
    console.log(previousLike);
    if (previousLike)
      return res
        .status(400)
        .json({ message: "You have liked this topic already." });
    const like = await Like.create({
      userId: req.user.id,
      topicId,
    });

    res.status(200).json({ like });
  } catch (err) {
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const prviousLike = await Like.findOne({
      where: { topicId: topicId, userId: req.user.id },
    });
    console.log(JSON.parse(JSON.stringify(prviousLike)));
    if (prviousLike === {})
      return res.status(400).json({ message: "Like not found." });
    console.log(JSON.parse(JSON.stringify(prviousLike)).userId, req.user.id);
    console.log(req.user);
    if (prviousLike.userId !== req.user.id)
      return res
        .status(400)
        .json({ message: "You cannot unlike other's like." });
    const unlike = await Like.destroy({
      where: {
        topicId,
        userId: req.user.id,
      },
    });
    res.status(204).json({ unlike });
  } catch (err) {
    next(err);
  }
};

exports.getLike = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const getLike = await Like.findAndCountAll({
      where: { topicId },
      include: [{ model: User, attributes: ["id", "username", "userImg"] }],
    });
    res.status(200).json({ topicId, getLike });
  } catch (err) {
    next(err);
  }
};
