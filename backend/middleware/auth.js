const {verifyToken} = require("../util/auth");

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        req.user = verifyToken(token);
        next();
    }catch(error) {
        res.status(401).json({error})
    }
}