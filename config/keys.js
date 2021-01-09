const keys_dev = require('./keys_dev')

module.exports = {
    mongoURI: process.env.MONGO_URI || keys_dev.DEV_MONGO_URI,
    secretString: process.env.SECRET_STRING || keys_dev.DEV_SECRET_STRING
}