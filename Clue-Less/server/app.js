const Express = require('express')();
const Http = require('http').Server(Express);
const Socketio = require('socket.io')(Http);

var position = {
    x: 100,
    y: 100
};

const gameState = {
    players: [],
    current_turn: 0
}

Http.listen(3000, () => {
    console.log('Listening at :3000...');
});

Socketio.on('connection', socket => {
    // a player has connected
    console.log('player conncted');

    // action upon player joining game
    gameState.players.push(socket);

    // action for changing which player's turn it is
    socket.on('pass_turn',function(){
        console.log('turn end attempt');
        if(gameState.players[gameState.current_turn] == socket){
            next_turn();
        }
        Socketio.emit('turnChange', gameState.current_turn); // emit to all clients
    })

    // for temporary block moving game play
    socket.emit('position', position);
    socket.on('move', data => {
        if(gameState.players[gameState.current_turn] == socket) {
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
        gameState.players.splice(gameState.players.indexOf(socket), 1);
        console.log("number of players now ", gameState.players.length);
    });
});

function next_turn() {
    gameState.current_turn = (gameState.current_turn + 1) % gameState.players.length;
    gameState.players[gameState.current_turn].emit('your_turn');
    console.log("next turn triggered " , gameState.current_turn);
}