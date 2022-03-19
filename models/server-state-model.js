module.exports = SERVER_STATE = {
    totalConnections: 0,
    allClients: [{
        socket: null,
        name: "",
        address: "",
        Money: 0,
        admin: false,
        UserMoney: 0,
        online: false,
        isLoggedIn: false,
        passiveMult: 1,
        totalWin: 0

    }],
    gameIsRunning: true,
    waitListClients: [{
        socket: null,
    }],
    areanas: [],
    appSettings: {

    },
    types: [{
        type: "Sun",
        strength: 11
    },
    {
        type: "Grass",
        strength: 4
    },
    {
        type: "Skull",
        strength: 15
    },
    {
        type: "Water",
        strength: 6

    }
    ]

}