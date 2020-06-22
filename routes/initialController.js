const account = require('../controllers/account/lib.js');
var express = require('express');
var router = express.Router();

router.get('/', account.loginForm);

module.exports = router;