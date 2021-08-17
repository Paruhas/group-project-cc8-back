module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
    {
      topicName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      topicContent: {
        type: DataTypes.STRING(15000),
        allowNull: false,
      },
      topicImg: {
        type: DataTypes.STRING,
      },
      topicStatus: {
        type: DataTypes.ENUM,
        values: ["ACTIVE", "INACTIVE"],
        defaultValue: "ACTIVE",
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  Topic.associate = (models) => {
    Topic.hasMany(models.Like, {
      foreignKey: {
        name: "topicId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Topic.hasMany(models.Pin, {
      foreignKey: {
        name: "topicId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Topic.hasMany(models.Report, {
      foreignKey: {
        name: "topicId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Topic.hasMany(models.Comment, {
      foreignKey: {
        name: "topicId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Topic.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Topic.belongsTo(models.Room, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Topic;
};
