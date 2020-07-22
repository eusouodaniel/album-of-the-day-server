var express = require('express');
var router = express.Router();
const Album = require('../schemas/album');
const withAuth = require('../middlewares/auth');

router.post('/', withAuth, async (req, res) => {
    const { title, artist, genre, image_url, best_music, embed } = req.body;
    let album = new Album({ title, artist, genre, image_url, best_music, embed, user: req.user._id });

    try {
        await album.save();
        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let album = await Album
            .findOne({ _id: id })
            .populate('user');

        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/', async (req, res) => {
    const { query } = req.query;
    try {
        if (query) {
            let albums = await Album
                .find({ $text: { $search: query } })
                .populate('user');
            res.send(albums)
        } else {
            let albums = await Album
                .find({})
                .populate('user');
            res.send(albums)
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

router.put('/:id', withAuth, async (req, res) => {
    const { title, artist, best_music, embed } = req.body;
    const { id } = req.params;
    try {
        let album = await Album.findById(id);
        if (isOwner(req.user, album)) {
            let album = await Album.findOneAndUpdate(
                { _id: id },
                { $set: { title: title, artist: artist, best_music: best_music, embed: embed } },
                { upsert: true, 'new': true }
            )

            res.json(album);
        } else {
            res.status(403).json({ error: "Permission denied" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error when update album" });
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    const { id } = req.params;
    try {
        let album = await Album.findById(id);
        if (isOwner(req.user, album)) {
            await Album.findByIdAndDelete(id);
            res.json({ message: "Ok" });
        } else {
            res.status(403).json({ error: "Permission denied" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error when delete album" });
    }
})

const isOwner = (user, album) => {
    if (JSON.stringify(user._id) == JSON.stringify(album.user._id)) {
        return true;
    }

    return false;
}

module.exports = router;
