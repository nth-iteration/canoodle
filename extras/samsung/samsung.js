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

(function(){
	if (document.body != null) {
		try { console.warn("Samsung.js MUST be added to the HEAD tag."); }
		catch(err) { /* no console.log? */ }
		return;
	}

	var widget = new Common.API.Widget();
	var plugin = new Common.API.Plugin();
	var tvKeyValue = new Common.API.TVKeyValue();

	// enable volume buttons and send signal to 
	window.addEventListener("load", function(){
		window.onShow = function() { // Call API for Volume OSD
			try {
				plugin.registIMEKey();
				plugin.unregistKey(tvKeyValue.KEY_VOL_UP);
				plugin.unregistKey(tvKeyValue.KEY_VOL_DOWN);
				plugin.unregistKey(tvKeyValue.KEY_MUTE);
				plugin.SetBannerState(1);
			} catch(err) {
				// meh, probably not a Samsung TV
			}
		};
		
		widget.sendReadyEvent();
	}, false);

	// no operation
	var noop = function() {};

	// create the Samsung object
	window.Samsung = {};
	window.Samsung.showIME = addSamsungIMEtoTextField;
	window.Samsung.hideIME = noop;
	window.Samsung.exitApp = function(){
		widget.sendExitEvent();
	};
	window.Samsung.enableScreenSaver = function() {
		try {
			plugin.setOnScreenSaver();
		} catch(err) {
			// meh, probably not a Samsung TV
		}
	};
	window.Samsung.disableScreenSaver = function() {
		try {
			plugin.setOffScreenSaver();
		} catch(err) {
			// meh, probably not a Samsung TV
		}
	};

	// Provided for ease of setting the input mode.
	window.Samsung.LOWERCASE = "_latin_small"; 	// "abcd", "boy", "girl"
	window.Samsung.CAPITALIZE = "_latin_cap"; 	// "Abcd", "Boy", "Girl"
	window.Samsung.UPPERCASE = "_latin_big"; 	// capital letters: "ABCD", "BOY", "GIRL"
	window.Samsung.NUMBERS = "_num"; 			// numeric letters: 1, 2, 3, 4
	window.Samsung.SPECIAL = "_special"; 		// special letters: !, @, #, $

	/**
	 * Generates a pseudo GUID
	 * @returns {string} A pseudo GUID
	 */
	var guid_c = 0;
	function getGuid() {
		function S4() {
			return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()) + "-" + (guid_c++);
	}
	
	// This method is exposed as Samsung.showIME
	function addSamsungIMEtoTextField(el, mode) {
		try {
			switch (mode) { // normalise mode, default to LOWERCASE
				case window.Samsung.LOWERCASE:
				case window.Samsung.CAPITALIZE:
				case window.Samsung.UPPERCASE:
				case window.Samsung.NUMBERS:
				case window.Samsung.SPECIAL:
					break;
				default:
					mode = window.Samsung.LOWERCASE;
					break;
			}

			// all text boxes used by the IME must have an ID
			if (el.id == "" || el.id == undefined) {
				var guid;
				do { guid = getGuid(); }
				while (document.getElementById(guid));
				el.id = guid;
			}
 
			new Input(el);				

			function Input(el) {
				var ime = new IMEShell(el.id, function(imeObj) {
					ime.setMode(mode);

					// adjust position of OSK, if necessary
					if (el.offsetLeft > window.innerWidth/2) {
						ime.setKeypadPos(20, 80);
						ime.setQWERTYPos(20, 80);
					} else {
						ime.setKeypadPos(window.innerWidth - 320, 80);
						ime.setQWERTYPos(window.innerWidth - 320, 80);
					}

					ime.setEnterFunc(blurIME);
					ime.setKeyFunc(tvKeyValue.KEY_RETURN, blurIME);
					ime.setKeyFunc(tvKeyValue.KEY_EXIT, function(){
						blurIME();
						window.Samsung.exitApp();
					});
					
					ime.setString(el.value);

					_g_ime.dim_use_YN = false;
					_g_ime.Recog_use_YN = true;

					if (_g_ime.pluginMouse_use_YN) {
						ime._focus();
					} else {
						ime.focus();
					}

					el.onblur = blurIME;
					window.Samsung.hideIME = blurIME;

					function blurIME() {
						window.Samsung.hideIME = noop;
						
						if (_g_ime.pluginMouse_use_YN) {
							ime._blur();
						} else {
							ime.blur();
						}
						ime = null; // we don't need this any more

						el.blur();
					}

				}, "en");
			}
		} catch(err) {
			// meh, probably not a Samsung TV
		}
	}
})();