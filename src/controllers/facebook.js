const requestPromise = require('request-promise');
const conversationHandler = require('../helpers/conversationHandler');

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
};

const postWebhook = (req, res) => {
  const data = req.body;

  // Make sure it's coming from a page
  if (data.object === 'page') {
    data.entry.forEach(entry => {
      const pageId = entry.id;
      const timeOfEvend = entry.time;

      // Now each of the messaging events
      entry.messaging.forEach(event => {
        if(event.message) {
          receivedMessage(event);
        } else {
          console.log('Received an unknown event', event);
        }
      });
    });
  }

  // Then we lie and tell facebook everything went fine and dandy
  res.sendStatus(200);
};

const receivedMessage = (event) => {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;
  const messageId = event.message.id;
  const text = event.message.text;

  // Do something magical
  const processedMessage = conversationHandler.process(text);

  processedMessage.then(response => {
    sendTextMessage(senderId, response);
  }).catch(error => {
    sendTextMessage(senderId, error);
  });
};

const sendTextMessage = (senderId, text) => {
  const message = {
    recipient: {
      id: senderId
    },
    message: {
      text
    }
  };

  callSendAPI(message);
};

const callSendAPI = (message) => {
  requestPromise({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.FB_PAGE_ACCESS_TOKEN
    },
    method: 'POST',
    json: message
  }).then(response => {
    if(response.statusCode === 200) {
      const {recipientId, messageId} = response

      console.log(`Message: ${messageId} sent to ${recipientId}`);
    }
  }).catch(error => {
    console.error('Unable to send message');
    console.error(error);
  });
};

module.exports = {
  getWebhook,
  postWebhook
};
