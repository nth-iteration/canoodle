/// <reference path="../debugger.d.ts" />
/// <reference path="../utils.d.ts" />

/**
 * Implements an interface for the Avoca Android application environment
 */

interface Window {
	LaunchInterface: {
		launchWebBrowser(url:string):void;
		launchWebApp(url:string):void;
	};
}

module Canoodle {
	export module Device {

        // the name of this device
		export var name = "Avoca Android";

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
			// Open a browser window as either a browser window or as a "app view"
			export function open(url:string, showToolbar = true):void {
				if (showToolbar) {
					window.LaunchInterface.launchWebBrowser(url);
				} else {
					window.LaunchInterface.launchWebApp(url);
				}
			}
		}
	}
}