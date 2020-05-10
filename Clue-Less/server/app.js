/*
    JavaScript Clueless game server that maintains connections of all clients.
    All communication from the frontend and the backend flows through the server.
*/


/*******************
    SERVER VARIABLES
*******************/

const Express = require('express')();
const Http = require('http').Server(Express);
const Socketio = require('socket.io')(Http);
const fs = require('fs');

const jsonRegex = /({([\S\s]*)})/;
const envFile = fs.readFileSync('./src/environments/environment.ts');
const env = JSON.parse(envFile.toString().match(jsonRegex)[1].toString());

// temporary variable used to hold the block position
let position = {
    x: 100,
    y: 100
};

let players = []; // holds an array of player sockets
let current_turn = 0; // keeps the current turn corresponding to playerId

/**************************
    END OF SERVER VARIABLES
**************************/


/*************************************************/
/*code that is executed upon starting the server*/
startServer();
onConnection();
/*************************************************/


/*************************************
    Methods that initialize the server
*************************************/

// starts the server listening on the specified port
function startServer() {
    Http.listen(env.serverPort, () => {
        console.log('Listening at :' + env.serverPort + '...');
    });
}

// tells the server what to do upon a socket connecting
// inlcude all methods that receive a signal from the frontend
function onConnection() {
    Socketio.on('connection', socket => {
        // a player has connected
        console.log('player conncted');
        let playerId = 'player' + players.length;
        socket.playerId = playerId; // set client's playerId corresponding to the nth client to connect to the server (starting at 0)
        socket.join(playerId); // an individual room that will be used to update the individual client

        players.push(socket); // adds this client's socket to the array of all connected sockets

        // include any method that receives a signal from the frontend
        enteredGame(socket);
        passTurn(socket);
        move(socket);
        disconnect(socket);
    });
}


/**************************************************
    Methods that RECEIVE a signal from the frontend
**************************************************/

// called when a player enters the game-menu screen
function enteredGame(socket) {
    socket.on('entered_game', function() {
        // update client with playerID
        Socketio.emit('turnChange', {turn: current_turn}); // emit to all clients the starting turn number
        socket.emit('position', {position: position}); // for temporary block moving game play
    });
}

// action for changing which player's turn it is
function passTurn(socket) {
    socket.on('pass_turn',function(){
        next_turn(socket);
    })
}

// for temporary block moving game play
function move(socket) {
    socket.on('move', data => {
        if(socket.rooms['player' + current_turn]) {
            switch(data.direction) {
                case 'left':
                    position.x -= 5;
                    Socketio.emit('position', {position: position});
                    break;
                case 'right':
                    position.x += 5;
                    Socketio.emit('position', {position: position});
                    break;
                case 'up':
                    position.y -= 5;
                    Socketio.emit('position', {position: position});
                    break;
                case 'down':
                    position.y += 5;
                    Socketio.emit('position', {position: position});
                    break;
            }
        }
    });
}

// action for when a player disconnects from the game
function disconnect(socket) {
    socket.on('disconnect', function() {
        console.log('A player disconnected');

        // increment turn
        current_turn = (current_turn + 1) % players.length;
        players[current_turn].emit('your_turn');
        Socketio.emit('turnChange', {turn: current_turn}); // emit to all clients

        // remove player socket from server
        players.splice(players.indexOf(socket), 1);
        next_turn(socket);
    });
}


/*********************************************
    Methods that SEND a signal to the frontend
*********************************************/

// increments the turn and updaets all clients
function next_turn(socket) {
    // only change the turn if it is the turn of the player who requested it
    if(!socket.rooms['player' + current_turn]) return;

    current_turn = (current_turn + 1) % players.length;
    players[current_turn].emit('your_turn');
    Socketio.emit('turnChange', {turn: current_turn}); // emit to all clients
}