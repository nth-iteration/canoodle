#!/usr/bin/env node

/*

Copyright (c) 2013 Avoca Learning

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// Command-line arguments:
var argv = require('optimist').argv;

// optionally set the port e.g. --port 8080
var PORT = (argv.port) ? parseInt(argv.port) : 4200;
if (isNaN(PORT) || PORT < 1024 || PORT > 65535) {
	console.info("The value for --port must be a number between 1024 and 65535.");
	process.exit(1);
}

// optionally set to append to a log file
var WRITE_LOG = (argv.log == true);
var LOG_FILE = "conodle.log";
var LOG_PATH = __dirname + "/";


var fs = require('fs'); // will be used to read and write files
fs.readFile("banner.txt", "utf8", function (err, data) {
	if (!err) {
		// prints a needless banner to the console
		console.log(data);
	}

	// start the HTTP and Socket IO servers
	var app = require('http').createServer(http_request);
	var io = require('socket.io').listen(app, {"log level": 1});
	io.sockets.on('connection', socket_io_init);
	app.listen(PORT); // change if necessary

	// print the execution settings
	console.log("Canoodle is listening on port "+PORT+".");
	if (WRITE_LOG) console.log("Logs will be appended to \""+LOG_FILE+"\".");
});

function http_request(req, res) {
	// meh, not implemented
}

function socket_io_init(socket) {
	/* Debugger will print logging messages to the console and optionally to a file */
	socket.on('Debugger', function(data) {
		if (data.jsonrpc != "2.0" 
			|| data.params == undefined 
			|| data.params.type == undefined 
			|| data.params.data == undefined) { // basic error checking
				console.warn("Error parsing data sent to the debugger log.");
		}

		// write the log to the screen
		var log = data.params.type.toUpperCase() + "\t" + data.params.data;
		console.log(log);

		if (WRITE_LOG) { // optionally append the log to a log file
			var file_log = (new Date()).toString() + "\t" + log;
			fs.appendFile(LOG_PATH, file_log, function(error) {
				if (error) { // something went wrong
					console.log("Error writing debugger message to log file.");
				}
			});
		}
	});
}