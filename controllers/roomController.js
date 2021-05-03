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

exports.getAllRoomsActive = async (req, res, next) => {
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

exports.getRoomByIdActive = async (req, res, next) => {
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
