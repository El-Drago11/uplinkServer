const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
    {
        clickCount: {
            type: Number,
            default: 0
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model('game',gameSchema);