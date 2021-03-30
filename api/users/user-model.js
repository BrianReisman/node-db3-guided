const db = require('../../data/db-config.js');

module.exports = {
    find,
    findById,
    findPosts,
    add,
    update,
    remove
}

//----------------------------------------------------------------------------//
// find()
//----------------------------------------------------------------------------//
// method to return all users.
//----------------------------------------------------------------------------//
function find() {
    return db('users');
}

//----------------------------------------------------------------------------//
// findById()
//----------------------------------------------------------------------------//
// The .first() method provides a simple way to detect empty results. .where()
// returns an array, but it could be an empty array. Using .first() returns the
// first object in the array, and if the array is empty, the first object is
// "undefined", which can be an easy test for "not the data I was looking for".
//
// you could also test the length of the array, and there are other methods to
// determine that the query didn't return the right stuff.
//----------------------------------------------------------------------------//
function findById(id) {
    return db('users').where({ id }).first();
}

//----------------------------------------------------------------------------//
// findPosts()
//----------------------------------------------------------------------------//
// Good example of using joins in knex. Take some time to look at the variety of
// parameter syntax options you have for the .join() method on the knexjs.org
// website.
//----------------------------------------------------------------------------//
function findPosts(id) {
    return db('posts as p')
        .join('users as u', 'u.id', 'p.user_id')
        .where({ user_id: id })
        .select('p.id', 'u.username', 'p.contents');
}

//----------------------------------------------------------------------------//
// add()
//----------------------------------------------------------------------------//
// we can just use the findById() method to return the new object after it has
// been added. Knex returns an array of ID's of newly created objects. Since we
// are only creating a single object, we get an array with one value, and use it
// to search for the newly created record. 
//
// Note that it is possible to pass in an array of objects to create. Knex will
// return an array of ID's  for the newly-created objects. The method used below
// would not prevent passing in an array of objects, but it would only return
// the object associated with the first ID in the array. How would you modify it
// to allow multile objects? what would you return?
//----------------------------------------------------------------------------//
async function add(userData) {
    const ids = await db('users').insert(userData);
    return newUser = await findById(ids[0]);
}

//----------------------------------------------------------------------------//
// update()
//----------------------------------------------------------------------------//
// again, using findById() to find the object that we changed.
//----------------------------------------------------------------------------//
async function update(id, changes) {
    console.log(db('users').where({ id }).update(changes).toString());
    await db('users').where({ id }).update(changes);
    return await findById(id);
}

//----------------------------------------------------------------------------//
// remove()
//----------------------------------------------------------------------------//
// simply delete the right one... :)
//----------------------------------------------------------------------------//
async function remove(id) {
    return await db('users').del().where({ id });
}