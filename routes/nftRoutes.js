const express = require("express")
const router = express.Router()
const nftData = require("../models/nft-model")



// Get all posts
router.get("/nft/:tokenId", async (req, res) => {
    tokenId = req.params.tokenId;
	const nft = await nftData.findOne({nftId: tokenId})
	res.send(nft)
})



module.exports = router