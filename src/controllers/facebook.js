const requestPromise = require('request-promise');

const isSubscribe = mode => mode === 'subscribe';
const isTokenValid = token => token === process.env.FB_VERIFY_TOKEN;

const getWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (isSubscribe(mode)) {
    console.log('Validating facebook token');
    if (isTokenValid(token)){
      console.log('Valid token');
      res.status(200).send(challenge);
    } else {
      console.log('Token validation failed. Make sure the validation tokens match');
      res.sendStatus(403);
    }
  }
}

module.exports = {
  getWebhook
}
