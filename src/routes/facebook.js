const router = require('express').Router()
const controller = require('../controllers/facebook');

router.get('/', controller.getWebhook);

module.exports = router;