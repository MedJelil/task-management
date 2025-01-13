const { Intervention, Intervenant, Client } = require("../models");

exports.createIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.create(req.body);
    res.status(201).json(intervention);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllInterventions = async (req, res) => {
  try {
    const interventions = await Intervention.findAll({
      include: [
        { model: Intervenant, attributes: ["nom", "prenom", "poste"] },
        { model: Client, attributes: ["nom", "prenom", "direction"] },
      ],
    });
    res.status(200).json(interventions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInterventionById = async (req, res) => {
  try {
    const intervention = await Intervention.findByPk(req.params.id, {
      include: [
        { model: Intervenant, attributes: ["nom", "prenom", "poste"] },
        { model: Client, attributes: ["nom", "prenom", "direction"] },
      ],
    });
    if (intervention) {
      res.status(200).json(intervention);
    } else {
      res.status(404).json({ error: "Intervention not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.findByPk(req.params.id);
    if (intervention) {
      await intervention.update(req.body);
      res.status(200).json(intervention);
    } else {
      res.status(404).json({ error: "Intervention not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.findByPk(req.params.id);
    if (intervention) {
      await intervention.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Intervention not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};