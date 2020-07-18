const mongoose = require('mongoose');

let albumSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        image_url: {
            type: String,
            required: true,
        },
        best_music: {
            type: String,
            required: true,
        },
        embed: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Album', albumSchema);