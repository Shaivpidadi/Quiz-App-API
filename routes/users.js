const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

const userFunction = require('../controller/user.controller');

const User = require('../model/users.model');
const Questions = require('../model/questions.model');


const auth = require('../middleware/auth');

mongoose.connect('mongodb://localhost/quiz', {useNewUrlParser: true});

router.post('/signup', function(req, res, next) {
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
                        const user = new User({
                            // _id: new mongoose.Schema.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            role: "user"
                        });

                        user.save()
                            .then( result => {
                                console.log(result);
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
});

router.post('/login',function (req, res) {

    // fetch role for admin access
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    userFunction.checkUser(user,res);
})

router.post('/add/questions',auth.verifyToken,function (req,res) {
    jwt.verify(req.token,'quizapisecretkey', (err, authData) => {
        if (err){
            res.status(403).send('Token Not matched');
        }
        else {
            const decode = jwtDecode(req.token);
            const role = decode.role;

            if (role == 'admin'){
                // Get Questions and insert in database
                const question = new Questions({
                    question: req.body.question,
                    question_options: req.body.question_options,
                    correct_answer: req.body.correct_answer,
                    updated_at: new Date()
                })

                question.save()
                    .then(result => {
                        console.log("result",result);
                        res.status(201).json({
                            message: 'Question has been added successfully'
                        });
                    })
                    .catch(err => console.log(err.message))
            }else {
                res.status(403).send("Not authorised")
            }
            // const isUserAdmin = await userFunction.isAdmin()
        }
    });
})





router.post('/questions',auth.verifyToken,function (req, res) {
    jwt.verify(req.token,'quizapisecretkey', (err, authData) => {
        if (err){
            res.status(403).send('Token Not matched');
        }
        else {
            res.json({
                // Fetch Questions from database
                message: JSON.stringify(Questions.find({},{limit : 5}))
            })
        }
    });
})



module.exports = router;