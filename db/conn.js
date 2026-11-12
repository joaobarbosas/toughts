const { Sequelize } = require('sequelize');

// Authenticate during startup, where rejected promises can be handled.
module.exports = new Sequelize(
  process.env.DB_NAME || 'toughts',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
  }
);
