var express = require('express');
var router = express.Router();
const Like = require('../schemas/like');
const withAuth = require('../middlewares/auth');

router.post('/', withAuth, async (req, res) => {
    const { album } = req.body;
    let like = new Like({ album: album._id, user: req.user._id });

    try {
        await like.save();
        res.status(200).json(like);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/', withAuth, async (req, res) => {
    try {
        let likes = await Like.find({ user: req.user._id });
        res.send(likes)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    const { id } = req.params;
    try {
        let like = await Like.findById(id);
        if (isOwner(req.user, like)) {
            await Like.findByIdAndDelete(id);
            res.json({ message: "Ok" });
        } else {
            res.status(403).json({ error: "Permission denied" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error when delete like" });
    }
})

const isOwner = (user, like) => {
    if (JSON.stringify(user._id) == JSON.stringify(Like.user._id)) {
        return true;
    }

    return false;
}

module.exports = router;
