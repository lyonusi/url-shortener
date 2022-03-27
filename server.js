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
        console.log('invalid url input');
        res.json(err);
  }});
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/api/shorturl/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  handler('redirect', shortUrl, function(err, result) {
    if (err) console.log('Error: ' + err);
    if (result !== undefined) {
      console.log('success');
      res.redirect(result);
  } else {
      console.log('invalid input');
      res.json(err);
    }})
  // res.json({ greeting: short });
});

app.get("/api/shorturl/", (req, res) => {
  const shortUrl = req.query.short_url;
  handler('redirect', shortUrl, function(err, result) {
    if (err) console.log('Error: ' + err);
    if (result !== undefined) {
      console.log('success');
      res.redirect(result);
  } else {
      console.log('invalid input');
      res.json(err);
    }})
  // res.json({ greeting: short });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

