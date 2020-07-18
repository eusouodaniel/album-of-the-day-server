const mongoose = require('mongoose');

let likeSchema = new mongoose.Schema(
    {
        album: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Album',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Like', likeSchema);