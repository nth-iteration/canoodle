/// <reference path="../debugger.d.ts" />
/// <reference path="../utils.d.ts" />

/**
 * Implements an interface for the Canoodle Viewer "device"
 */

interface Window {
	browser: {
		go(url:string, showToolbar? : bool):void;
		getAPIVersion(): string;
	};
}

module Canoodle {
	export module Device {

        // the name of this device
		export var name = "Canoodle Viewer";

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
			// Opens Canoodle Viewer browser
			export function open(url:string, showToolbar = true):void {
				window.browser.go(url, showToolbar);
			}
		}
	}
}	
