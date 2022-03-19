const mongoose = require('mongoose')


const nftSchema = new mongoose.Schema({
    owner: {type: String, required: false},
    type: {type: String, required: false},
    level: {type: Number, default: 1},
    nftId: {type: Number, unique: true},
    battlesWon: {type: Number, required: false},
    battlesLost: {type: Number, required: false},
    rank: {type: Number, required: false, unique: true},
    rarity: {type: Number, required: false}
})


module.exports = mongoose.model('nfts', nftSchema);