module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "intervention",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("soft", "hard"),
        allowNull: false,
      },
      motive: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      intervenantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "intervenant",
          key: "id",
        },
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "client",
          key: "id",
        },
      },
    },
    {
      freezeTableName: true, // Prevents pluralizing table name
      timestamps: false, // Disables createdAt and updatedAt columns
    }
  );
};
