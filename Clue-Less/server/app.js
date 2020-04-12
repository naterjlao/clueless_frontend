const Express = require('express')();
const Http = require('http').Server(Express);
const Socketio = require('socket.io')(Http);
const fs = require('fs');

const jsonRegex = /({([\S\s]*)})/;
const envFile = fs.readFileSync('./src/environments/environment.ts');
const env = JSON.parse(envFile.toString().match(jsonRegex)[1].toString());

var position = {
    x: 100,
    y: 100
};

let players = [];
let current_turn = 0;

Http.listen(env.serverPort, () => {
    console.log('Listening at :' + env.serverPort + '...');
});

Socketio.on('connection', socket => {
    // a player has connected
    console.log('player conncted');
    let playerId = 'player' + players.length;
    socket.join(playerId);
    socket.playerId = playerId; // set client's playerId

    // action upon player joining game
    players.push(socket);

    socket.on('enteredGame', function() {
        // update client with playerID
        socket.emit('startInfo', {player: socket.playerId}); // emit to this client
        Socketio.emit('turnChange', current_turn); // emit to all clients the starting turn number
        socket.emit('position', position); // for temporary block moving game play
    });

    // action for changing which player's turn it is
    socket.on('pass_turn',function(){
        next_turn(socket);
    })

    // for temporary block moving game play
    socket.on('move', data => {
        if(socket.rooms['player' + current_turn]) {
            switch(data) {
                case 'left':
                    position.x -= 5;
                    Socketio.emit('position', position);
                    break;
                case 'right':
                    position.x += 5;
                    Socketio.emit('position', position);
                    break;
                case 'up':
                    position.y -= 5;
                    Socketio.emit('position', position);
                    break;
                case 'down':
                    position.y += 5;
                    Socketio.emit('position', position);
                    break;
            }
        }
    });

    // action for when a player disconnects from the game
    socket.on('disconnect', function() {
        console.log('A player disconnected');

        // increment turn
        current_turn = (current_turn + 1) % players.length;
        players[current_turn].emit('your_turn');
        Socketio.emit('turnChange', current_turn); // emit to all clients

        // remove player socket from server
        players.splice(players.indexOf(socket), 1);
        next_turn(socket);
    });
});

function next_turn(socket) {
    // only change the turn if it is the turn of the player who requested it
    if(!socket.rooms['player' + current_turn]) return;

    current_turn = (current_turn + 1) % players.length;
    players[current_turn].emit('your_turn');
    Socketio.emit('turnChange', current_turn); // emit to all clients
}
