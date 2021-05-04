exports.createRoom = async (req, res, next) => {
  try {
    const { roomName, roomIcon } = req.body;
    if (!roomName || roomName.trim())
      return res.status(400).json({ message: `Room's name is required.` });
    if (!roomIcon || roomName.trim())
      return res.status(400).json({ message: `Room's icon is required.` });
    const room = await Room.findAll({ where: { roomName } });
    if (room)
      return res
        .status(400)
        .json({ message: "Room has already been created." });
    await Room.create({ roomName, roomIcon });
    res
      .status(201)
      .json({ message: `Room ${roomName} is created successfully` });
  } catch (err) {
    next(err);
  }
};
exports.updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomName, roomIcon, roomStatus } = req.body;

    const room = await Room.findAll({ where: { id } });
    if (!room) return res.status(400).json({ message: "Room not found." });
    await Room.update({ roomName, roomIcon, roomStatus }, { where: { id } });
    res.status(201).json({ message: `Room id ${id} is updated successfully` });
  } catch (err) {
    next(err);
  }
};
