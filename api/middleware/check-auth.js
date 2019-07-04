const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("check-auth.js says: token is ", token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (e) {
        return res.status(401).json({
            message: 'Auth Failed',
            e
        })
    }
};
