const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const memories = require('./routes/api/memories');
const users = require('./routes/api/users');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// DB Config
const db = require('./config/keys').mongoURI;

// env Config
// require('dotenv').config()

// Connect to Mongo
mongoose
    .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// User Routes
app.use('/api/memories', memories);
app.use('/api/users', users);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));