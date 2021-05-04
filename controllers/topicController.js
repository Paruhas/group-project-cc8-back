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
