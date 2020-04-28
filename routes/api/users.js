const express = require('express');
const router = express.Router();

// User Model
const User = require('../../models/User');

// GET all users
router.get('/', (req, res) => {
    User
        .find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST a user
router.post('/', (req, res) => {
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
});

// DELETE a user
router.delete('/remove/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(user => user.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json('Error: ' + err));
})

module.exports = router;