
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').load();

const facebookRouter = require('./routes/facebook');

const port = 3000;

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // Health check to verify that the server is running
  res.send('I\'m just a health check :)');
});

app.use('/facebook', facebookRouter);

app.listen(port, () => {
  console.log(`Magic bot server running on port ${port}! 🦄 🤖`);
});
