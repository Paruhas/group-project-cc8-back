const { Room } = require("../models");

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json({ rooms });
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(400).json({ message: "roomById not found" });
    }

    res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};

exports.getAllActiveRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      where: {
        roomStatus: "ACTIVE",
      },
    });

    if (!rooms) {
      return res
        .status(400)
        .json({ message: "rooms not found ; or not have active status" });
    }

    res.status(200).json({ rooms });
  } catch (err) {
    next(err);
  }
};

exports.getActiveRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({
      where: {
        id: id,
        roomStatus: "ACTIVE",
      },
    });

    if (!room) {
      return res
        .status(400)
        .json({ message: "roomById not found ; or not have active status" });
    }

    res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { roomName, roomIcon } = req.body;
    if (!roomName || !roomName.trim())
      return res.status(400).json({ message: `Room's name is required.` });
    if (!roomIcon || !roomIcon.trim())
      return res.status(400).json({ message: `Room's icon is required.` });
    const room = await Room.findAll({ where: { roomName } });
    if (room.length)
      return res
        .status(400)
        .json({ message: "Room has already been created." });
    const name = roomName.toUpperCase();
    await Room.create({ roomName: name, roomIcon });
    res.status(201).json({ message: `Room ${name} is created successfully` });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomName, roomIcon, roomStatus } = req.body;

    let name;

    const room = await Room.findAll({ where: { id } });

    if (!room) return res.status(400).json({ message: "Room not found." });

    if (roomName) {
      const checkDuplicatRroom = await Room.findAll({ where: { roomName } });
      if (checkDuplicatRroom.length)
        return res
          .status(400)
          .json({ message: "Room has already been created." });

      name = roomName.toUpperCase();
    }

    await Room.update(
      { roomName: name, roomIcon, roomStatus },
      { where: { id } }
    );
    res.status(201).json({ message: `Room id ${id} is updated successfully` });
  } catch (err) {
    next(err);
  }
};
