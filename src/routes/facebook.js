const router = require('express').Router()
const controller = require('../controllers/facebook');

router.get('/', controller.getWebhook);

router.post('/', controller.postWebhook);

module.exports = router;
