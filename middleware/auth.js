const jwt = require('jsonwebtoken');

function isTokenAvailable(req,res, next) {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader != 'undefined'){
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            // res.headers("authorization", `Bearer ${token}`).send();
            next();
        }
        else{
            res.status(403).send('Forbidden');
        }
}

function verifyToken(req, res, next) {

    jwt.verify(req.token,'quizapisecretkey', (err, authData) => {
        if (err){
            res.status(403).send('Token Not matched');
        }
        else {
            next()
        }
    });

}

module.exports = {
    verifyToken,
    isTokenAvailable
}

