var tree, enemyTree;
var delta = 1;
var socket = io.connect('http://localhost:3004');

function joinGame (team) {
  $('#welcome').hide();
  $('#gamescreen').show();

  socket.emit('playerUpdate', {
            "player": {
            "action" : "register",
            "team" : team
            }});
}

function change (tree, amount) {
  socket.emit('playerUpdate', {
    "player": {
      "action": "change",
      "tree": tree,
      "amount": amount
    }
});
}

function reset () {
  socket.emit('playerUpdate', {
    "player": {
      "action": "reset"
    }
});
}

// socket.on('connect', function (data) {  });
var tHeight1 = 1;
var tHeight2 = 1;
socket.on('serverUpdate', function (data) {

  console.log (data);

  switch (data.server.action) {
    case "gameStatus":
      $("#gamestatus").text(data.server.message);
    break;

    case "treeStatus":
      tHeight1 = data.server.message.items[0].amount;
      tHeight2 = data.server.message.items[1].amount;
    break;

    case "winner":
      alert("The winner is team " + data.server.message)
    break;
}
});
