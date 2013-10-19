/// <reference path="../debugger.d.ts" />
/// <reference path="../utils.d.ts" />


/**
 * Implements an interface for PC
 */

module Canoodle {
	export module Device {

        // the name of this device
		export var name = "Generic PC";

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
			ESC:	27
		}

        /**
         * An interface to simulate a Browser
         */
        export module Browser {
			// Open a browser window
			export function open(url:string, showToolbar = true):void {
				window.open(url, "_blank", ((showToolbar) ? "" : "location=no,menubar=no,toolbar=no"));
			}
		}
	}
}