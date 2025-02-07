module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "intervenant",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: { type: DataTypes.STRING, allowNull: false },
      prenom: { type: DataTypes.STRING, allowNull: false },
      poste: { type: DataTypes.STRING, allowNull: false },
    },
    {
      freezeTableName: true, // Prevents pluralizing table name
      timestamps: false, // Disables createdAt and updatedAt columns
    }
  );
};
