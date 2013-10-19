/// <reference path="../debugger.d.ts" />
/// <reference path="../utils.d.ts" />

/**
 * Implements an interface for the Digisoft Irish device
 */

module Canoodle {
	export module Device {

        // the name of this device
		export var name = "Digisoft Iris";

		// KeyCode values for essential keys
		export var Keys = {
			LEFT: 	37,
			RIGHT: 	39,
			UP: 	38,
			DOWN: 	40,
			SPACE: 	32,
			ENTER:	13,
			DELETE:	8,
			TAB:	9,
			ESC:	65296
		}

        /**
         * Web socket handling. All communication with Iris happens over web sockets
         * @type {WebSocket}
         */
        var websocket = new WebSocket('ws://localhost:80', 'digibrowser_websock');

		websocket.onopen = function(e:any):void {
			// Digisocket: CONNECTED
		};
		
		websocket.onclose =function(e:any):void {
			// Digisocket: CLOSED
		};
		
		websocket.onmessage = function (e:any):void {
			// Digisocket: MESSAGE
			var message = parseMessage(e.data);

			function parseMessage(msg:string):any {
				var lines:string[] = msg.split("\n");
				var obj:any = {};
				for (var i:number = 0; i < lines.length; i++) {
					var key = lines[i].split("=")[0];
					var val = lines[i].split("=")[1];
					if (key == "") continue;
					Canoodle.Debugger.log("Key: "+key+", Val: "+val);
					obj[key] = val;
				}
				return obj;
			}
		};
		
		websocket.onerror = function(e:any):void {
			// Digisocket: ERROR
		};

        /**
         * An interface to simulate a Browser
         */
		export module Browser {
			// Opens a new Irish web browser window
			export function open(url:string, showToolbar = true):void {
			}
		}

	}
}