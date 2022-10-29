const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const secretString = require('../config/keys').secretString;
const secretString = process.env.SECRET_STRING

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '', username: ''}

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered'
    }

    if (err.message === 'incorrect username') {
        errors.username = 'There is no such username'
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect'
    }

    // duplicate error code
    if (err.message.includes('email_1 dup key')) {
        errors.email = 'That email is already registered'
        return errors
    }

    if (err.message.includes('username_1 dup key')) {
        errors.username = 'That username is already in use'
        return errors
    }

    // validate errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(error => {
            let { properties } = error
            let message = properties.message
            if (properties.message == 'Path `password` is required.') message = 'Please enter a password'
            if (properties.message == 'Path `username` is required.') message = 'Please enter a username'
            console.log(properties.path)
            console.log(properties.message)
            console.log('----')
            errors[properties.path] = message
        })
    }
    console.log(errors)
    return errors
}

const maxAge = 3 * 24 * 60 * 60
const createToken = payload => {
    return jwt.sign(payload, secretString, { expiresIn: maxAge })
}

module.exports.signup_post = async (req, res) => {
    const { username, creationDate, email, password } = req.body.userInfo;

    try {
        const user = await User.create({ username, creationDate, email, password })
        const token = createToken({ id: user._id, user: username })
        //res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        console.log('...')
        console.log(errors)
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async (req, res) => {
    const { username, password, creationDate, email } = req.body.userInfo
    console.log(req.headers.token)

    try {
        // the static method "login" is declared in the User model in User.js
        const user = await User.login(username, password) 
        const token = createToken({ id: user._id, user: username })
        
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        User
            .findOne({ username })
            .then(user => res.status(200).json({ username, email: user.email, creationDate: user.creationDate, settings: user.settings, token }))
            .catch(err => console.log(err))
        
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// Cookies stopped working after separating the frontend 
// and backend servers (rip Heroku)
module.exports.verify_user_get = (req, res, next) => {
    // all middleware has the "next" method
    // const token = req.cookies.jwt;
    // //check json web token exists & is verified

    // if (token) {
    //     jwt.verify(token, secretString, (err, decodedToken) => {
    //         if (err) {
    //             console.log(err.message)
    //             res.status(400).json({ user: null })
    //         } else {
    //             res.status(201).json({ user: decodedToken.id, token })
    //         }
    //     })
    // } else {
    //     res.status(400).json({ user: null });
    // }
    
    // to notify frontend when db connection is complete
    User
        .estimatedDocumentCount()
        .then(c => {
            res.status(200).json({ msg: `Hello! (${c})` })
        })
        .catch(() => {
            res.status(400).json({ msg: 'H-h...help' })
        })
    
}

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).json({ msg: 'cookie removed '})
}

module.exports.user_get = (req, res) => {
    User
        .findById(req.user_id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json('Error: ' + err));
}

// Update user preferences / settings 

module.exports.user_update = (req, res) => {
    User
        .findOne({ username: req.user })
        .then(user => {
            let settings = JSON.parse(user.settings)
            let [property, value] = req.body

            settings[property] = value

            user.updateOne({ $set : { settings : JSON.stringify(settings) } })
                .then(() => res.json('User updated!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(404).json('Error: ' + err));
}


/// Original controllers

module.exports.users_get = (req, res) => {
    User
        .find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.user_post = (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        creationDate: req.body.creationDate
    });

    newUser
        .save()
        .then(user => res.json(user))
        .catch(err => res.status(404).json('Error: ' + err));
}

module.exports.user_delete = (req, res) => {
    User
        .findById(req.user_id)
        .then(user => user.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json('Error: ' + err));
}