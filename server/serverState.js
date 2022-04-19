var SERVER_STATE = require('../models/server-state-model')
const nftData = require('../models/nft-model')




module.exports = (app, io) => {

    // initialAreana = {
    //     nftTokenIdOne: 0,
    //     nftTokenIdTwo: 0
    // }
    // SERVER_STATE.areanas.push(initialAreana)

    initialAreana = {
        areanaId: 1,
        nftTokenIdOne: 0,
        nftTokenIdTwo: 0,
        nftTokenOneOwner: ""
    }
    SERVER_STATE.areanas.push(initialAreana)


    function startTimer() {
        var serverTick = setInterval(() => {
            if(SERVER_STATE.appSettings.timerVal === 0){
                //call the no more bets for each socket
                //get a player from queue and emit it to all clients
                var random = Math.floor(Math.random() * SERVER_STATE.queue.length)
                console.log(random)
                // SERVER_STATE
                io.emit('addPlayerToFight')
                clearInterval(serverTick);
                SERVER_STATE.appSettings.timerVal = 30;
                startTimer();
            } else {
                io.emit('timerTick', (SERVER_STATE.appSettings.timerVal--))
                var random = Math.floor(Math.random() * (10+1))
                console.log(random)
    
                console.log(SERVER_STATE.appSettings.timerVal)
            }
           
        }, 1000);
    }

    startTimer()
    
    

    io.on('connection', socket => {
        console.log(socket.id);
        sendBack = {areanas: SERVER_STATE.areanas}

        socket.emit('areanas', sendBack)

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
            if(SERVER_STATE.areanas[data-1] && (SERVER_STATE.areanas[data-1].nftTokenIdOne === 0 || SERVER_STATE.areanas[data-1].nftTokenIdTwo === 0)){
                return;
            }
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


            //transfer nfts n stuff
            if(randomOne > randomTwo){
                console.log("NFT ONE WON: ", randomOne)
            } else {
                console.log("NFT TWO WON: ", randomTwo)
            }

            //reset the areana
            SERVER_STATE.areanas[data-1].nftTokenIdOne = 0;
            SERVER_STATE.areanas[data-1].nftTokenIdTwo = 0;


            sendBack = {areanas: SERVER_STATE.areanas}

            // socket.emit('areanas',sendBack)
            io.emit('areanas', sendBack)


            console.log(percentOneWillWin)
            console.log(totalValueOne)
        })


        //add queing
        socket.on('sendNftToAreana', async function(data, func){
            console.log(data)

            if(!data.tokenId){

                //emit an error
                return;
            }


            if(SERVER_STATE.areanas[data.areanaId-1].nftTokenIdOne === 0){
                SERVER_STATE.areanas[data.areanaId-1].nftTokenIdOne = data.tokenId;
                SERVER_STATE.areanas[data.areanaId-1].nftTokenOneOwner = data.owner;
            } else if(SERVER_STATE.areanas[data.areanaId-1].nftTokenIdTwo === 0 && SERVER_STATE.areanas[data.areanaId-1].nftTokenIdOne !== data.tokenId){
                SERVER_STATE.areanas[data.areanaId-1].nftTokenIdTwo = data.tokenId;
            } else {
                //theres something in both they want to join the queue
                if(!data.owner){
                    //emit an error 
                    return;
                }

                var canAdd = true;
                //loop through queue 
                for(var i = 0; i < SERVER_STATE.queue.length; i++){
                    if(SERVER_STATE.queue[i].owner == data.owner){
                        //cant have the same owner in the queue twice
                        canAdd = false;
                    }
                }

                if(canAdd){
                    player = {
                        owner: data.owner,
                        nftId: data.tokenId
                    }
                    SERVER_STATE.queue.push(player)
                }
                
            }

            sendBack = {areanas: SERVER_STATE.areanas}

            io.emit('areanas',sendBack)
        })

    })

}