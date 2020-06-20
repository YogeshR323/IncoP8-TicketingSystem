const account = require('../controllers/account/lib');
const express = require('express');
const router = express.Router()

router.get('/login', account.loginForm);
// router.get('/login', (req, res) => {res.render('account/login', {title: 'Sign in'});})
router.post('/login', account.login);
router.get('/signup', account.signupForm);
router.post('/signup', account.signup);
router.get('/signout', account.signout);
router.get('/', (req, res) => {
    res.redirect('/user/login')
})

module.exports = router;