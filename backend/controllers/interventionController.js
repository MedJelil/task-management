const { Intervention, Intervenant, Client, sequelize } = require("../models");

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

exports.getStatistics = async (req, res) => {
  try {
    const [totalClients, totalInterventions, totalIntervenants] =
      await Promise.all([
        Client.count(),
        Intervention.count(),
        Intervenant.count(),
      ]);
    // Fetch top 5 clients
    const topClients = await Client.findAll({
      attributes: [
        [
          sequelize.fn(
            "CONCAT",
            sequelize.col("nom"),
            " ",
            sequelize.col("prenom")
          ),
          "fullName",
        ],
        [
          sequelize.fn("COUNT", sequelize.col("interventions.id")),
          "interventionCount",
        ],
      ],
      include: [
        {
          model: Intervention,
          attributes: [],
          required: false, // Use LEFT JOIN
        },
      ],
      group: ["client.id"],
      order: [[sequelize.literal("interventionCount"), "DESC"]],
      limit: 5,
      subQuery: false, // Prevent nested subqueries
    });

    // Fetch top 5 intervenants
    const topIntervenants = await Intervenant.findAll({
      attributes: [
        [
          sequelize.fn(
            "CONCAT",
            sequelize.col("nom"),
            " ",
            sequelize.col("prenom")
          ),
          "fullName",
        ],
        [
          sequelize.fn("COUNT", sequelize.col("interventions.id")),
          "interventionCount",
        ],
      ],
      include: [
        {
          model: Intervention,
          attributes: [],
          required: false, // Use LEFT JOIN
        },
      ],
      group: ["intervenant.id"],
      order: [[sequelize.literal("interventionCount"), "DESC"]],
      limit: 5,
      subQuery: false, // Prevent nested subqueries
    });

    // Fetsh intervention status counts
    const statusCounts = await Intervention.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    res
      .status(200)
      .json({
        topClients,
        topIntervenants,
        statusCounts,
        totalClients,
        totalInterventions,
        totalIntervenants,
      });
  } catch (err) {
    console.error("Error fetching top clients and intervenants:", err);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};
