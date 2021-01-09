let mongoURI;

if (process.env.MONGO_URI) {
    console.log('BINGO')
    mongoURI = process.env.MONGO_URI
} else {
    console.log('Preset string :(')
    mongoURI = "mongodb+srv://JadeDRB:3GVYr8IXKYvmv9Ym@cluster0-xbvbt.gcp.mongodb.net/test?retryWrites=true&w=majority"
}

module.exports = {
    mongoURI: process.env.MONGO_URI,
    secretString: process.env.SECRET_STRING || "super secret string wow"
}