const User = require('../model/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const mailer = require('../services/nodemail');
const Joi = require('joi');


const crypto = require('crypto');
const validate = require('../validators/validate');
const questionDb = require('./questions.controller.js');


function signup(req, res) {
    User.find({email: req.body.email})
        .exec()
        .then( function(user) {
            if (user.length >= 1){
                res.send("Mail Exists");
            }else {
                bcrypt.hash(req.body.password,10,(err,hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const token = crypto.randomBytes(16).toString('hex');
                        const link="http://"+req.get('host')+"/users/verify/?id="+token;
                        const user = new User({
                            // _id: new mongoose.Schema.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            role: "user",
                            isVerified : false,
                            token : token
                        });

                        const result = Joi.validate(req.body, validate.Register);
                        if (result.error){
                            res.status(400).send(result.error.details[0].message);
                            return;
                        }
                        user.save()
                            .then( result => {
                                mailer.mail(req.body.email,link);
                                res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(201).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err.message);
        })
}

function login(req,res) {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const result = Joi.validate(req.body, validate.Login);
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    checkUser(user,res);
}

function findQuestions(req, res) {
    questionDb.getQuestions()
        .then(result => {
            res.json({
                // Fetch Questions from database
                message: result
            })
        })
}

function getScore(req, res) {
    const submittedData = req.body.submitted_data;
    const decode = jwtDecode(req.token);
    const email = decode.user.email;

    questionDb.checkScore(submittedData)
        .then(result => {
            mailer.mailResult(email,result);
            res.json({
                message: `Your Score is ${result}`
            })
        })
}

function accountVerify(req, res) {
    const token = req.query.id;

    getDbToken(req.body.email)
        .then(result => {
            if (result.token == token){
                User.update({'email': req.body.email},{$set: {'isVerified': true}})
                    .exec()
                    .then( function() {
                        res.status(201).json({
                            message: 'Email Verified Successfully'
                        });
                    })
                    .catch(err => {
                        console.log(err.message);
                    })

            }else{
                res.status(400).json({
                    message: 'Token is wrong or expired'
                });
            }

        })
}
async function checkUser(user,res) {
    const isUserRegistered = await
        isInDb(user.email)

    if (isUserRegistered == null){
        res.status(403).send('User Not Found');
    }

    else {
        if (isUserRegistered.isVerified === false){
            res.status(403).send('Email Not Verified.');
        }else {
            getAccessToken(user,isUserRegistered,res);
        }
    }
}

async function isInDb(email) {
    return await User.findOne({email : email});
}

async function getAccessToken(user,registeredUser,res) {
    try {
        const match = await bcrypt.compare(user.password, registeredUser.password);
        if(match) {
            jwt.sign({user, role: registeredUser.role},'quizapisecretkey', (err, token) => {
                res.json({
                    "access_token" : token
                })
            })
        }
        else {
            res.status(403).send('Password not matched');
        }
    }
    catch(error) {
        console.log(error.message);
    }
}

async function getDbToken(email) {
    return await User.findOne({email: email},{token:1})
}


module.exports = {
    checkUser,
    isInDb,
    signup,
    login,
    findQuestions,
    getScore,
    accountVerify
}
