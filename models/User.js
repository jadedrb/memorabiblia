const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    }, 
    password: {
        type: String,
        required: true,
        minlength: [5, 'Minimum password length is 5 characters']
    },
    username: { 
        type: String,
        unique: true, 
        required: true,
        minlength: [3, 'Minimum password length is 3 characters']
    },
    creationDate: { 
        type: String 
    },
    settings: {
        type: String,
        default: '{}'
    }
});

// mongoose middleware - fire function before doc saved to db
UserSchema.pre('save', async function (next) {
    // "this" represents the instance of the user we're trying to create 
    // (aka the local version of the user we're about to save)

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user. This is used in authController.js
UserSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username })

    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user 
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect username')
}

module.exports = User = mongoose.model('user', UserSchema)