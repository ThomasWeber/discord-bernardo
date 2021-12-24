// knex.js
const knex = require('knex')
const config = require('./database-config.js')


module.exports = knex(config)