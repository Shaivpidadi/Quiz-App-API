function verifyToken(req, res, next) {
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

// function isAdmin(req,res,next) {
//     const role = await User.findOne({email : email});
//     console.log("This is Admin");
// }

module.exports = {
    verifyToken
}

