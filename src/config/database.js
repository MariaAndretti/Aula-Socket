const { Sequelize } = require('sequelize')

const {
    PSQL_USER, PSQL_PASS, PSQL_HOST, PSQL_PORT, PSQL_DATABASE
} = process.env

const sequelizeConn = new Sequelize(`
    postgres://${PSQL_USER}:${PSQL_PASS}@${PSQL_HOST}:${PSQL_PORT}/${PSQL_DATABASE}`
);

module.exports = sequelizeConn;
