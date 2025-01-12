const { Intervenant } = require("../models");

exports.createIntervenant = async (req, res) => {
  try {
    const intervenant = await Intervenant.create(req.body);
    res.status(201).json(intervenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllIntervenants = async (req, res) => {
  try {
    const intervenants = await Intervenant.findAll();
    res.status(200).json(intervenants);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getIntervenantById = async (req, res) => {
  try {
    const intervenant = await Intervenant.findByPk(req.params.id);
    if (intervenant) {
      res.status(200).json(intervenant);
    } else {
      res.status(404).json({ error: "Intervenant not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateIntervenant = async (req, res) => {
  try {
    const intervenant = await Intervenant.findByPk(req.params.id);
    if (intervenant) {
      await intervenant.update(req.body);
      res.status(200).json(intervenant);
    } else {
      res.status(404).json({ error: "Intervenant not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteIntervenant = async (req, res) => {
  try {
    const intervenant = await Intervenant.findByPk(req.params.id);
    if (intervenant) {
      await intervenant.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Intervenant not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// version 2

// const db = require("../utils/db");

// // CRUD operations for Intervenant
// exports.createIntervenant = (req, res) => {
//   const { nom, prenom, poste } = req.body;
//   const query = "INSERT INTO Intervenant (Nom, Prenom, Poste) VALUES (?, ?, ?)";
//   db.query(query, [nom, prenom, poste], (err, result) => {
//     if (err) throw err;
//     res.json({
//       message: "Intervenant added successfully",
//       id: result.insertId,
//     });
//   });
// };

// exports.getIntervenants = (req, res) => {
//   const query = "SELECT * FROM intervenant";
//   db.query(query, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// };

// exports.updateIntervenant = (req, res) => {
//   const { id } = req.params;
//   const { nom, prenom, poste } = req.body;
//   const query =
//     "UPDATE Intervenant SET Nom = ?, Prenom = ?, Poste = ? WHERE IdIntervenant = ?";
//   db.query(query, [nom, prenom, poste, id], (err, result) => {
//     if (err) throw err;
//     res.json({
//       message: "Intervenant updated successfully",
//       affectedRows: result.affectedRows,
//     });
//   });
// };

// exports.deleteIntervenant = (req, res) => {
//   const { id } = req.params;
//   const query = "DELETE FROM Intervenant WHERE IdIntervenant = ?";
//   db.query(query, [id], (err, result) => {
//     if (err) throw err;
//     res.json({
//       message: "Intervenant deleted successfully",
//       affectedRows: result.affectedRows,
//     });
//   });
// };
