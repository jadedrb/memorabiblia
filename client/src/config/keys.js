const keys_dev = process.env.GBOOKS_API || require('./keys_dev')

module.exports = {
    gBooksApi: process.env.GBOOKS_API || keys_dev.DEV_GBOOKS_API,
    defineApi: process.env.DEFINE_API || keys_dev.DEV_DEFINE_API,
    gBooksApiKey: process.env.GBOOKS_API_KEY || keys_dev.DEV_GBOOKS_API_KEY,
    defineApiKey: process.env.DEFINE_API_KEY || keys_dev.DEV_DEFINE_API_KEY
}