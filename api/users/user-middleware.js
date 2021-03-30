const db = require('./user-model.js');
const ExpressError = require('../ExpressError.js');

async function validateUserId(req, res, next) {
    try {
        const user = await db.findById(req.params.id);
        if (user) {
            req.user = user;
            next()
        } else {
            next(new ExpressError('invalid id', 404));
        }
    } catch (err) {
        next(err, 500);
    }
}

async function validateUserBody(req, res, next) {
    if (!req?.body?.username) {
        next(new ExpressError('body must include username', 400));
    } else {
        next();
    }
}

module.exports = {
    validateUserId,
    validateUserBody
}