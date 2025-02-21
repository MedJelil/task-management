const dotenv = require("dotenv");
const { Sequelize, DataTypes } = require("sequelize");

dotenv.config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log, // Log SQL queries
  }
);

// Import models
const Intervenant = require("./intervenantModel")(sequelize, DataTypes);
const Client = require("./clientModel")(sequelize, DataTypes);
const Intervention = require("./interventionModel")(sequelize, DataTypes);
const Admin = require("./adminModel")(sequelize, DataTypes);

// Define associations
Intervenant.hasMany(Intervention, { foreignKey: "intervenantId" });
Client.hasMany(Intervention, { foreignKey: "clientId" });
Intervention.belongsTo(Intervenant, { foreignKey: "intervenantId" });
Intervention.belongsTo(Client, { foreignKey: "clientId" });

// Export models and sequelize instance
module.exports = { sequelize, Intervenant, Client, Intervention, Admin };
