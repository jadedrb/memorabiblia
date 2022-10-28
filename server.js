const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const memories = require('./routes/api/memories');
const users = require('./routes/api/users');

// Config
const keys_dev = require('./config/keys');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Connect to Mongo
mongoose
    .connect(keys_dev.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// User Routes
app.use('/api/memories', memories);
app.use('/api/users', users);

// Test Route for Heroku env variables
app.post('/heroku-env', (req, res) => {
    const { gBooksApi, gBooksApiKey, defineApi, defineApiKey } = keys_dev
    const hVarPackage = { gBooksApi, gBooksApiKey, defineApi, defineApiKey }
    if (req.body.hVarAuth === 'PAJAMA') res.status(200).json(hVarPackage)
    else res.status(400).json({ error: 'Nothing to see here...'})
})

/*
// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
*/

const port = process.env.PORT || 5000 || 5001;

app.listen(port, () => console.log(`Server started on port ${port}`));