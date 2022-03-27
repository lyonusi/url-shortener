require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const handler = require('./service/service');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoUri = process.env['MONGO_URI'];

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(mongoUri, { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected.')
});

db.on('error', err => {
  console.error('connection error:', err)
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/public', express.static(`${process.cwd()}/public`));

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  handler('shorten',originalUrl, function(err, result){
    if (err) console.log('Error: ' + err);
    if (result !== undefined) {
        console.log('success');
        res.json(result);
    } else {
        console.log('invalid result');
        res.sendFile(__dirname + '/public/index.html');
  }});
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post("/api/shorturl/:originalUrl", function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

