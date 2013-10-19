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

	This script will:
		1. automatically display a Samsung app when DOM has loaded
		2. automatically enable volume and mute control
		3. expose a method to attach and display the IME for a textbox

	Use:

		<input type="text" onfocus="javascript:Samsung.showIME(this, Samsung.NUMBERS);" />

	The first agument in Samsung.showIME the text input field to attache the IME to.

	The second arugment is optional. Optional values are:

 		- Samsung.LOWERCASE
 		- Samsung.CAPITALIZE
 		- Samsung.UPPERCASE
 		- Samsung.NUMBERS
 		- Samsung.SPECIAL

	IMPORTANT!

	The following files must be linked from the HEAD of your document
	(NB: set path to Samsung.js as appropriate):

		<!-- Samsung Official Libraries -->
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/API/Widget.js"></script>
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/API/Plugin.js"></script>
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/API/TVKeyValue.js"></script>
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/Util/Include.js"></script>
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/Util/Language.js"></script>
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/Plugin/Define.js"></script>
		<script type='text/javascript' src='$MANAGER_WIDGET/Common/webapi/1.0/webapis.js'></script>

		<!-- Samsung.js -->
		<script type='text/javascript' src='Samsung.js'></script>

	The following must be linked from the BODY of your document:

		<!-- Samsung: IME -->
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/IME_XT9/ime.js"></script>
		<script type="text/javascript" src="$MANAGER_WIDGET/Common/IME/ime2.js"></script>

		<!-- Samsung: OSD -->
		<object id="pluginObjectTVMW" border=0 classid="clsid:SAMSUNG-INFOLINK-TVMW" style="visibility:hidden; position:absolute; width: 0; height: 0; opacity: 0;"></object>
		<object id="pluginObjectNNavi" border=0 classid="clsid:SAMSUNG-INFOLINK-NNAVI" style="visibility:hidden; position:absolute; width: 0; height: 0; opacity: 0;"></object>
*/

(function(){
	if (document.body != null) {
		try { console.warn("Samsung.js MUST be added to the HEAD tag."); }
		catch(err) { /* no console.log? */ }
		return;
	}

	// enable volume buttons and send signal to 
	window.addEventListener("load", function(){
		window.onShow = function() { // Call API for Volume OSD
			try {
				var widget = Common.API.Widget();
				var pluginAPI = new Common.API.Plugin();
				var tvKey = new Common.API.TVKeyValue();

				pluginAPI.registIMEKey();
				pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
				pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
				pluginAPI.unregistKey(tvKey.KEY_MUTE);
				pluginAPI.SetBannerState(2);

				window.addEventListener("keydown", function(event) {
				    var keyCode = event.keyCode;
					if (keyCode = tvKey.KEY_RETURN) {
						if (window.history.length == 0) {
							widget.blockNavigation(event);
							window.history.back();
						} // widget.sendReturnEvent();
					}
				}

			} catch(err) {
				// meh, probably not a Samsung TV
			}
		};
		
		var widgetAPI = new Common.API.Widget();
		widgetAPI.sendReadyEvent();
	}, false);

	// create the Samsung object
	window.Samsung = {};
	window.Samsung.showIME = addSamsungIMEtoTextField;

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
					var tvKey = new Common.API.TVKeyValue();

					ime.setMode(mode);
					ime.setEnterFunc(blurIME);
					ime.setKeyFunc(tvKey.KEY_RETURN, blurIME);
					ime.setKeyFunc(tvKey.KEY_EXIT, function() {
						sendExitEvent();
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

					function blurIME() {
						if (_g_ime.pluginMouse_use_YN) {
							ime._blur();
						} else {
							ime.blur();
						}
						ime = null; // we don't need this any more
					}

				}, "en");
			}
		} catch(err) {
			// meh, probably not a Samsung TV
		}
	}
})();