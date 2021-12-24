const knex = require("./knex.js");

knex.schema.createTable('user', table => {
    table.integer('id').unsigned().notNullable().unique();
    table.string('user');
    table.string('username');
    table.string('shorttag');
    table.string('tag');
    table.string('location');
    table.integer('server');
    table.string('updated');
    table.integer('lock');
})


knex.schema.createTable('alias', table => {
    table.integer('id').unsigned().notNullable().unique();
    table.string('user_id').notNullable();
    table.string('name').unique().notNullable();
    table.string('type');
})

module.exports = knex;