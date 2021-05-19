module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
    {
      reportContent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reportStatus: {
        type: DataTypes.ENUM,
        values: ["REPORT", "REJECT"],
        defaultValue: "REPORT",
        allowNull: false,
      },
      adminDescription: {
        type: DataTypes.STRING,
      },
    },
    {
      underscore: true,
    }
  );
  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    Report.belongsTo(models.Topic, {
      foreignKey: {
        name: "topicId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Report;
};
