require('dotenv').config()

const keys_dev = process.env.MONGO_URI || require('./keys_dev')

module.exports = {
    mongoURI: process.env.MONGO_URI || keys_dev.DEV_MONGO_URI,
    secretString: process.env.SECRET_STRING || keys_dev.DEV_SECRET_STRING
}