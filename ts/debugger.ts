/// <reference path="utils.d.ts" />
/// <reference path="definitions/socket.io.d.ts" />

/**
 * A rudimentary remote debugger (or just a logger for now). Connects to the Canoodle server, using NodeJS and
 * Sockets IO.
 */
module Canoodle {

	export module Debugger {
		declare var io; 

		var socket:any = null;
		var connected = false;

        /**
         * Starts the debugger and connects to a Socket IO server at a given URL and port.
         * @param url The URL (IP address or domain name) for the Canoodle server
         * @param port The port at which the Canoodle server is running.
         */
        export function start(url:string = "127.0.0.1", port:number = 4200):void {
			var url = "http://"+url+":"+port;
			Canoodle.Utils.execute(url + "/socket.io/socket.io.js");
			socket = io.connect(url);
			socket.on('connect', function() {
				connected = true;
			});
		}

        /**
         * Sends a message to the Canoodle server to log.
         * @param msg A String of the message to log
         * @param type An option 'type' for the message. Defaults to INFO.
         */
		export function log(msg:string, type:string = "INFO"):void {
			if (!connected) {
				console.warn("Canoodle: Attempt to connect to Debugger socket when socket is not connected.");
				return;
			}

			var obj = {
				jsonrpc: "2.0",
				method: "log",
				params: {
					type: type.toString().toUpperCase(),
					data: msg
				}
			}

			socket.emit("Debugger", obj);
		}

	}

}