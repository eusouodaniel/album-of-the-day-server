const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const secret = process.env.JWT_TOKEN;

const withAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: "Invalid token" });
            } else {
                req.email = decoded.email;
                User.findOne({ email: decoded.email })
                    .then(user => {
                        req.user = user;
                        next();
                    }).catch(err => {
                        res.status(401).json({ error: "Internal server error" })
                    })
            }
        })
    }
}

module.exports = withAuth;