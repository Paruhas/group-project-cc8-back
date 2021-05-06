module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userImg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      userRole: {
        type: DataTypes.ENUM,
        values: ["ADMIN", "USER"],
        defaultValue: "USER",
        allowNull: false,
      },
      userStatus: {
        type: DataTypes.ENUM,
        values: ["ACTIVE", "INACTIVE", "BANNED"],
        defaultValue: "ACTIVE",
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Topic, {
      foreignKey: {
        name: "userId",
        allowNull: "false",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    User.hasMany(models.Like, {
      foreignKey: {
        name: "userId",
        allowNull: "false",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    User.hasMany(models.Pin, {
      foreignKey: {
        name: "userId",
        allowNull: "false",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    User.hasMany(models.Report, {
      foreignKey: {
        name: "userId",
        allowNull: "false",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    User.hasMany(models.Comment, {
      foreignKey: {
        name: "userId",
        allowNull: "false",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return User;
};
