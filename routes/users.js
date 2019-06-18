const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userFunction = require('../controller/user.controller');
const questionFunction = require('../controller/questions.controller.js');

const auth = require('../middleware/auth');

mongoose.connect('mongodb://localhost/quiz', {useNewUrlParser: true});

router.post('/signup', userFunction.signup);

router.get('/verify/:key?', userFunction.accountVerify);

router.post('/login/',userFunction.login);

router.use(auth.isTokenAvailable)

router.post('/add/questions',auth.verifyToken, questionFunction.addQuestions);

router.post('/questions',auth.verifyToken,userFunction.findQuestions);

router.get('/questions/submit',auth.verifyToken,userFunction.getScore);


module.exports = router;

