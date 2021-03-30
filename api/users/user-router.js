const express = require("express");
const ExpressError = require('../ExpressError.js');
const { validateUserId, validateUserBody } = require('./user-middleware.js');


// the knex reference that used to be here (through db-config) is replaced by a
// reference to our data model object: user-model.
const Users = require('./user-model.js');

const router = express.Router();

//----------------------------------------------------------------------------//
// Each of these middleware route handlers have been refactored to use our
// model db functions from user-model.js.
// 
// This helps us keep our source files single-purpose, simplifying testing and
// troubleshooting, etc.
//
// The name "model" is really just a reference to the role of that "layer or
// logic" in the design - it's where our database methods are. 
// 
// This follows the typical MVC pattern. You can read about it here:
//    https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller 
// 
//----------------------------------------------------------------------------//

router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    next(new ExpressError(err, 500));
  }
});

router.get("/:id", validateUserId, async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.log(err);
    // const myerr = new ExpressError('error getting user: ' + err.message, 500)
    // next(myerr);
    res.status(500).json({ err: 'err' });
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  const { id } = req.params;

  try {
    const posts = await Users.findPosts(id);
    res.json(posts);
  } catch (err) {
    console.log(err);
    next(new ExpressError(err, 500));
  }
})

router.post("/", validateUserBody, async (req, res, next) => {
  const userData = req.body;
  try {
    const newUser = await Users.add(userData);
    res.json(newUser);
  } catch (err) {
    console.log(err);
    next(new ExpressError(err, 500));
  }

});

router.put("/:id", validateUserId, validateUserBody, async (req, res, next) => {
  const { id } = req.user;
  const changes = req.body;

  try {
    const changedUser = await Users.update(id, changes);
    res.json(changedUser);
  } catch (err) {
    console.log(err);
    next(new ExpressError(err, 500));
  }
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  const { id } = req.user;

  try {
    const count = await Users.remove(id);
    res.json({ message: `deleted ${count} records` });
  } catch (err) {
    console.log(err);
    next(new ExpressError(err, 500));
  }
});

router.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({ message: err.message })
})

module.exports = router;
