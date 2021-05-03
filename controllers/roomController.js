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
