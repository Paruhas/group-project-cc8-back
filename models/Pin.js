module.exports = (sequelize, DataTypes) => {
  const Pin = sequelize.define(
    "Pin",
    {},
    {
      underscored: true,
    }
  );
  Pin.associate = (models) => {
    Pin.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Pin.belongsTo(models.Topic, {
      foreignKey: {
        name: "topicId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Pin;
};
