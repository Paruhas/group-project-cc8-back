const { sequelize, Like } = require("../models");

exports.createLike = async (req, res, next) => {
  const { id } = req.params
  const like = await Like.create({
    userId: req.user,
    topicId: id
  })
  res.status(200).json({like})
}

exports.deleteLike = async (req, res, next) => {
  const { id } = req.params;
  const unlike = await Like.destroy({
    where: {
      topicId: id,
      userId: user.id,
    },
  });
}


exports.getLike = async (req, res, next) => {
  const { id } = req.body
  const getLike = await Like.findAndCountAll({ where: { topicId: id } });
  res.status(200).json( getLike.count );
}




