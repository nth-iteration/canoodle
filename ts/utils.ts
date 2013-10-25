/**
 * A collection of stand-alone helpful utilities.
 */

module Canoodle {
	export module Utils {
        /**
         * A function to read a file given a URL. NB: The read happens synchronously
         * @param url The URL of the file to read
         * @returns {string} The content of the file as a string. The string will be empty in the case of error.
         */
		export function read(url:string):string {
			var file:string;

			// NB: load the file synchronously
			var xmlhttp:XMLHttpRequest = new XMLHttpRequest(); // create the XMLHttpRequest object
			xmlhttp.open("GET", url, false);
			xmlhttp.send();

			if (xmlhttp.status !== 200) {
				console.error("HTTP status "+xmlhttp.status+" returned for file: " + url);
				return "";
			}

			file = (xmlhttp.responseXML !== null)
				? xmlhttp.responseXML.toString()
				: xmlhttp.responseText;

			return file;
		}

        /**
         * Executes a script from a file given the URL to the file. NB: the file is read synchronously
         * @param url The URL of the file to be read
         * @returns {Function|function(string): *}  The value returned upon executing the script
         */
        export function execute(url:string):any {
			var code:string = read(url);
            return (window.execScript || function (code:string):any {
                return window["eval"].call(window, code);
            })(code);
		}

        /**
         * Generates a pseudo GUID string (example: CANOODLE-1db3a461-e1e7-889b-cc46-b9b5619028e8)
         * @param id An option string to prepend to the start of the pseudo GUID. Defaults to "CANOODLE".
         * @returns {string} A pseudo GUID string.
         */
        export function guid(id:string = "CANOODLE"):string {
			// http://note19.com/2007/05/27/javascript-guid-generator/
			function S4() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			}
			return id + "-" + (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		}

	}
}