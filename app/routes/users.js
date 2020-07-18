var express = require('express');
var router = express.Router();
const User = require('../schemas/user');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_TOKEN;
const withAuth = require('../middlewares/auth');

router.post('/login', async function (req, res) {
    const { email, password } = req.body.credential;
    let user = await User.findOne({ email });
    try {
        if (!user) {
            res.status(401).json({ error: "Incorrect email or password" });
        } else {
            user.isCorrectPassword(password, function (err, same) {
                if (!same) {
                    res.status(401).json({ error: "Incorrect email or password" });
                } else {
                    const token = jwt.sign({ email }, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
                    res.status(200).send({ user: user, token: token });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal error" });
    }
});

router.post('/register', async function (req, res) {
    const { name, email, celphone, password } = req.body.credential;
    const user = new User({ name, email, password, celphone });

    try {
        await user.save();
        const token = jwt.sign({ email }, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(200).send({
            user: user,
            token: token
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error registering new user please try again" });
    }
});

router.put('/user-profile', withAuth, async (req, res) => {
    const { name, celphone } = req.body;
    try {
        let user = await User.findById(req.user._id);
        if (isOwner(req.user, user)) {
            let user = await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { name: name, celphone: celphone } },
                { upsert: true, 'new': true }
            )

            res.send({ user: user, updated: true });
        } else {
            res.status(403).json({ error: "Permission denied" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error when update user" });
    }
})

router.post('/forgot-password', async function (req, res) {
    const { email, password, celphone } = req.body;
    if (celphone) {
        let user = await User
            .find({ email: email })
            .find({ celphone: celphone });
        if (user) {
            res.send(user);
        }
        if (!user) {
            res.status(403).send({
                error: 'Email or celphone invalid',
            });
        }
    } else {
        let user = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { password: password } },
            { upsert: true, 'new': true }
        );
        res.send({ updated: true });
    }
});

const isOwner = (req, user) => {
    if (JSON.stringify(req._id) == JSON.stringify(user._id)) {
        return true;
    }
    return false;
}

module.exports = router;
