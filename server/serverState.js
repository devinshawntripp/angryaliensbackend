var SERVER_STATE = require('../models/server-state-model')
const nftData = require('../models/nft-model')

initialAreana = {
    areanaId: 1,
    nftTokenIdOne: 0,
    nftTokenIdTwo: 0
}
SERVER_STATE.areanas.push(initialAreana)


module.exports = (app, io) => {

    // initialAreana = {
    //     nftTokenIdOne: 0,
    //     nftTokenIdTwo: 0
    // }
    // SERVER_STATE.areanas.push(initialAreana)

    io.on('connection', socket => {
        console.log(socket.id);

        // socket.on('sendNftId', async function(tokenId, func) {
        //     // console.log(tokenId)
        //     // data = await nftData.findOne({nftId: tokenId}).then((res) => {
        //     //     console.log(res)
        //     // })

        //     // console.log(tokenId);


        //     socket.emit('getNftData', data)
        // })
        // io.to(socket).emit('init', SERVER_STATE.areanas)
        socket.emit('init', SERVER_STATE.areanas)

        socket.on('fight', async function(data, func) {
            const tokenOne = await nftData.findOne({nftId: SERVER_STATE.areanas[data-1].nftTokenIdOne})
            const tokenTwo = await nftData.findOne({nftId: SERVER_STATE.areanas[data-1].nftTokenIdTwo})

            const typeValueOne = tokenOne.type;
            const typeValueTwo = tokenTwo.type;
            var totalValueOne = 0;
            var totalValueTwo = 0;

            SERVER_STATE.types.map(type => {
                if(type.type === typeValueOne){
                    totalValueOne = type.strength
                }
                if(type.type === typeValueTwo){
                    totalValueTwo = type.strength
                }
            })

            totalValueOne += tokenOne.level *2;
            totalValueTwo += tokenTwo.level *2;


            if(tokenOne.rank < tokenTwo.rank){
                totalValueOne += 10
            } else {
                totalValueTwo += 10
            }

            let percentOneWillWin = (totalValueOne*100) / (totalValueOne+totalValueTwo)

            let randomOne = Math.floor(Math.random() * totalValueOne)
            let randomTwo = Math.floor(Math.random() * totalValueTwo)
            console.log(percentOneWillWin)
            console.log(totalValueOne)
        })


        socket.on('sendNftToAreana', async function(data, func){
            console.log(data)
            if(SERVER_STATE.areanas[data.areanaId-1].nftTokenIdOne === 0){
                SERVER_STATE.areanas[data.areanaId-1].nftTokenIdOne = data.tokenId;
            } else if(SERVER_STATE.areanas[data.areanaId-1].nftTokenIdTwo === 0 && SERVER_STATE.areanas[data.areanaId-1].nftTokenIdOne !== data.tokenId){
                SERVER_STATE.areanas[data.areanaId-1].nftTokenIdTwo = data.tokenId;
            }

            sendBack = {areanas: SERVER_STATE.areanas}

            socket.emit('areanas',sendBack)
        })

    })

}