var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');


var trees = {"items": [
    {"amount" : 1},
    {"amount" : 1}
]};


var teams = {"items": [
    {"amount" : 1},
    {"amount" : 1}
]};


// handle incomming connections

app.listen(3004);

io.sockets.on('connection', function (socket) {


	socket.on('playerUpdate', function (data) {

		//console.log (data);

		switch (data.player.action) {
      case "change":
        console.log('amount', data.player.amount)
        var temp0 = trees.items[data.player.tree-1].amount += data.player.amount;
        var temp1 = trees.items[data.player.tree].amount += data.player.amount;

        if(temp0 < 0 )
          trees.items[data.player.tree-1].amount = 0;
        else if(temp1 < 0) {
          trees.items[data.player.tree].amount = 0;
        }
        else {
          trees.items[data.player.tree-1].amount += data.player.amount;
          if(trees.items[data.player.tree-1].amount > 100)
            winEnd(1)
          else if(trees.items[data.player.tree].amount > 100)
            winEnd(2)
        }
      break;

			case "register":
				publicMsg("gameStatus", "Player joined team " + data.player.team);
				teams.items[data.player.team-1].amount ++;

			break;

			case "quit":
				publicMsg("gameStatus", "Player left team " + data.player.team);
				teams.items[data.player.team-1].amount --;
			break;

    case "reset":
      trees = {"items": [
          {"amount" : 1},
          {"amount" : 1}
      ]};


      teams = {"items": [
          {"amount" : 1},
          {"amount" : 1}
      ]};
    break;



		}


		publicMsg("treeStatus", trees);

	});

  function winEnd(team){
    publicMsg("winner", team);
  }


	socket.on('disconnect', function (data) {
		// socket.get('playerNumber', function (err, value) {});



	});



	// Helper functions

	function privateMsg (action, msg) {
		socket.emit('serverUpdate', {
			"server": {
				"action": action,
				"message": msg
			}
		});
	}

	function opponentMsg (action, msg) {
		socket.broadcast.emit('serverUpdate', {
			"server": {
				"action": action,
				"message": msg
			}
		});
	}


	function publicMsg (action, msg) {
		privateMsg (action, msg);
		opponentMsg (action, msg);
	}

});


// this serves HTML files etc

function handler (req, res) {
  if (req.url == "/") {req.url = "/index.html";}
  fs.readFile(__dirname + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end('404 File not found');
    }
    res.writeHead(200);
    res.end(data);
  });
}

