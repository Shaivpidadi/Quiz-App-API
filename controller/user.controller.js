const User = require('../model/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function checkUser(user,res) {
    const isUserRegistered = await isInDb(user.email);
    console.log("isUserRegistered",isUserRegistered);

    if (isUserRegistered == null){
        res.status(403).send('User Not Found');
    }

    else {
        getAccessToken(user,isUserRegistered,res);
    }
}

async function isInDb(email) {
    return await User.findOne({email : email});
}



// async function isAdmin(email) {
//     const role = await User.findOne({email : email});
//     console.log("This is Admin",role);
// }

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

module.exports = {
    checkUser,
    isInDb
}