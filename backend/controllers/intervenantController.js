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
