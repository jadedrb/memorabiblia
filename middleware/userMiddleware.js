// UNUSED MIDDLEWARE (as of now)

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    // all middleware has the "next" method
    const token = req.cookies.jwt;

    //check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'super secret string wow', (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.status(400).json({ user: null })
            } else {
                console.log(decodedToken)
                next()
            }
        })
    } else {
        res.status(400).json({ user: null });
    }
}

// res.status(201).json({ user: user._id });  400 for error

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    console.log('checkUser middleware...')
    if (token) {
        jwt.verify(token, 'super secret string wow', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.currentUser = null
                next()
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                console.log('$$$')
                console.log(user)
                res.locals.currentUser = user
                next()
            }
        })
    } else {
        console.log(token)
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser };