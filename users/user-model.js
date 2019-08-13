const db = require('../data/db-config.js');

// TODO: as additional exercise, implement the update and remove methods
// and refactor your router to use the model methods.
module.exports = {
    find,
    findById,
    findPosts,
    add,
    // update,
    // remove
}

function find() {
    return db('users');
}

// the .first() method provides a simple way to 
// detect empty results. .where() returns an array, but
// it could be an empty array. Using .first() returns
// the first object in the array, and if the array is empty,
// the first object is "null", which can be an easy test 
// for "not the data I was looking for".
//
// you could also test the length of the array, and there are other
// methods to determine that the query didn't return the right stuff.
function findById(id) {
    return db('users')
        .where({id})
        .first();
}

// good example of using joins in knex.
// take some time to look at the variety of 
// parameter syntax options you have for the .join()
// method on the knexjs.org website.
function findPosts(user_id) {
    return db('posts as p')
        .join('users as u', 'u.id', 'p.user_id')
        .select('p.id', 'u.username', 'p.contents')
        .where({user_id});
}

// this returns the user that was added.
// we decorate this method with "async" so we can 
// use "await" in calling knex (which returns a promise).
// We didn't need to do this in the other methods above
// beause they are returning the value from knex directly,
// keeping the promise chain intact. But here, we are
// assigning knex's result to a variable, so we need to
// use "await", so we get the return value back.
//
// if you don't use "await" before a method that normally returns a promise, 
// instead of getting the return value that is "resolved" in the promise,
// you get the promise object. We don't want the promise object. We want 
// the resolved value of the promise... and that could take some time,
// so we need to signal to the JavaScript engine tha we want to wait
// for the promise to be either Resolved or Rejected...
async function add(user) {
    const [id] = await db('users').insert(user);
    return findById(id);
}