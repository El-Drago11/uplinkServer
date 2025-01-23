const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
    {
        clickCount: {
            type: Number,
            default: 0
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model('game',gameSchema);