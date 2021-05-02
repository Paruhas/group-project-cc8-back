module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      roomName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomIcon: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomStatus: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["ACTIVE", "INACTIVE"],
        defaultValue: "ACTIVE",
      },
    },
    {
      underscored: true,
    }
  );
  Room.associate = (models) => {
    Room.hasMany(models.Topic, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Room;
};
