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

// version 2

// const db = require("../utils/db"); // Assuming a MySQL connection instance

// const createIntervenant = (nom, prenom, poste, callback) => {
//   const query = "INSERT INTO Intervenant (Nom, Prenom, Poste) VALUES (?, ?, ?)";
//   db.query(query, [nom, prenom, poste], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };

// const getIntervenants = (callback) => {
//   const query = "SELECT * FROM Intervenant";
//   db.query(query, (err, results) => {
//     if (err) return callback(err);
//     callback(null, results);
//   });
// };

// const updateIntervenant = (id, nom, prenom, poste, callback) => {
//   const query =
//     "UPDATE Intervenant SET Nom = ?, Prenom = ?, Poste = ? WHERE IdIntervenant = ?";
//   db.query(query, [nom, prenom, poste, id], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };

// const deleteIntervenant = (id, callback) => {
//   const query = "DELETE FROM Intervenant WHERE IdIntervenant = ?";
//   db.query(query, [id], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };

// module.exports = {
//   createIntervenant,
//   getIntervenants,
//   updateIntervenant,
//   deleteIntervenant,
// };
