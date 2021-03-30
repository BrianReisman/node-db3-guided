module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/blog.db3',
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    // needed when using foreign keys by default, knex doesn't enforce foreign
    // key values... that means that by default, if I want to store 9999 in a
    // foreign key field, but the foreign table doesn't have a record with ID
    // === 9999, SQLite *will let me*. This can be bad... we want SQLite to
    // validate that the foreign key we are trying to store actually exists as
    // the primary key for a record in the foreign table. This bit of code
    // (stored as the value of the "afterCreate" property) ensures that SQLite
    // will check and validate for us.
    pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
      },
    },
  },
};