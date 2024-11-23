var app = require('http').createServer(handler)
	  , io = require('socket.io').listen(app)
	  , fs = require('fs')
	  , exec = require('child_process').exec
	  , util = require('util')
	
	app.listen(8080);

	function handler (req, res) {
	  fs.readFile(__dirname + '/index.html',
	  function (err, data) {
	    if (err) {
	      res.writeHead(500);
	      return res.end('Error loading index.html');
	    }
	    res.writeHead(200);
	    res.end(data);
	  });
	}
	
	io.sockets.on('connection', function (socket) {
		//Events will go here
        socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
			var Name = data['Name'];
			Files[Name] = {  //Create a new Entry in The Files Variable
				FileSize : data['Size'],
				Data	 : "",
				Downloaded : 0
			}
			var Place = 0;
			try{
				var Stat = fs.statSync('Temp/' +  Name);
				if(Stat.isFile())
				{
					Files[Name]['Downloaded'] = Stat.size;
					Place = Stat.size / 524288;
				}
			}
	  		catch(er){} //It's a New File
			fs.open("Temp/" + Name, "a", 0755, function(err, fd){
				if(err)
				{
					console.log(err);
				}
				else
				{
					Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
					socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
				}
			});
	});
	});

    
    