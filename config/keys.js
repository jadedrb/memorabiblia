const keys_dev = process.env.NODE_ENV // || require('./keys_dev')
console.log(process.env.NODE_ENV)
module.exports = {
    mongoURI: process.env.MONGO_URI || keys_dev.DEV_MONGO_URI,
    secretString: process.env.SECRET_STRING || keys_dev.DEV_SECRET_STRING,
    gBooksApi: process.env.GBOOKS_API || keys_dev.DEV_GBOOKS_API,
    defineApi: process.env.DEFINE_API || keys_dev.DEV_DEFINE_API,
    gBooksApiKey: process.env.GBOOKS_API_KEY || keys_dev.DEV_GBOOKS_API_KEY,
    defineApiKey: process.env.DEFINE_API_KEY || keys_dev.DEV_DEFINE_API_KEY
}