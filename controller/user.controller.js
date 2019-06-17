const User = require('../model/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const mailer = require('../services/nodemail');

const crypto = require('crypto');

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
    checkUser(user,res);
}

function findQuestions(req, res) {
    jwt.verify(req.token,'quizapisecretkey', (err, authData) => {
        if (err){
            console.log("Some Error");
            res.status(403).send('Token Not matched');
        }
        else {
            questionDb.getQuestions()
                .then(result => {
                    res.json({
                        // Fetch Questions from database
                        message: result
                    })
                })
        }
    });
}

function getScore(req, res) {
    jwt.verify(req.token,'quizapisecretkey', (err, authData) => {
        if (err){
            res.status(403).send('Token Not matched');
        }
        else {
            const submittedData = req.body.submitted_data;
            questionDb.checkScore(submittedData)
                .then(result => {
                    res.json({
                        message: `Your Score is ${result}`
                    })
                })
        }
    });
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
