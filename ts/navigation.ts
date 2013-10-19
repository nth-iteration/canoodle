/// <reference path="devices/device.d.ts" />

declare var $:any;

module Canoodle {

	export module Navigation {

        interface Point {
            x: number;
            y: number;
        }

		// warns a user of dependencies of the Canoodle Navigation module
		if (typeof $ == "undefined") {
			console.warn("The Canoodle Navigation module requires jqMobi (recommended) or jQuery."
			+ "\njqMobi: http://app-framework-software.intel.com/\njQuery: http://jquery.com/");
		}

        var Attributes = {
            selected: "data-canoodle-selected",
            containsSelected: "data-canoodle-contains-selected",
            focused: "data-canoodle-focused"
        }

        var Selectors = {
            target: "*[data-canoodle-selectable='default'],*[data-canoodle-selectable='true'],button,input:enabled,textarea,select[multiple],textarea,section[data-canoodle-scroll='auto'],section[data-canoodle-scroll='true']",
            selected: "*[data-canoodle-selected='true']",
            default: "*[data-canoodle-selected='default'],*[data-canoodle-selected='true']",
            containsSelected: "*[data-canoodle-contains-selected='true']",
            selectable: "*[data-canoodle-selectable='true'],button,input[type='image']",
            scrollable: "section[data-canoodle-scroll='auto'],section[data-canoodle-scroll='true']",
            formfield: "input,textarea,select",
            focused: "*[data-canoodle-focused='true']",
            formfieldFocused: "input:focus,textarea:focus,select:focus",
            carousel: {
                rail: "*[data-canoodle-container='carousel']",
                mask: "*[data-canoodle-container='mask']"
            }
        }

		// used to prevent input until a Unix timestamp
		var blockInputUntilTime:number = 0;

        /**
         * The publicly exposed method to select an element
         * @param el A valid jQuery-style selector indicating the element to be selected
         */
		export function select(el:any) {
            var target:any = $(el);

            if (target.is(Selectors.selectable)) {
                unselectedAll();
                select2(target);
			} else {
				console.warn("Could not select element. The element is not selectable.")
			}
			update();
		}

        /**
         * The private (raw) method to select an element
         * @param target A jQuery-style object of the element to select
         */
        function select2(target:any) {
            target.attr(Attributes.selected, "true");
            target.parents("menu").attr(Attributes.containsSelected, "true");
        }

        /**
         * Clears the selected item, but leaves indicated as being the default object
         */
        export function clearSelected():void {
            $(Selectors.selected).attr(Attributes.selected, "default");
            $(Selectors.containsSelected).removeAttr(Attributes.containsSelected);
        }

        /**
         * Clears the selected elment, but does not leave any object as the default
         */
        function unselectedAll():void {
            $(Selectors.selected).removeAttr(Attributes.selected);
            $(Selectors.containsSelected).removeAttr(Attributes.containsSelected);
        }

        /**
         * Get the currently selected element
         * @returns {*} The currently selected HTML DOM element.
         */
        export function getSelected():any {
            return $(Selectors.selected).get();
        }
		
		/*
		 * Forces an update of the appearance of elements based on selection state, etc. Currently only carousel items
		 * need to be updated in this way.
		 */
	    export function update(){
            updateCarousel();
        }

	    // don't assume mouse input unless this varible is 0, used to switch from keyboard input to mouse input
		var ignoreMouseEventCountDown:number = 0;

		/*
		 * Listen for key input and handle
		 */
		window.addEventListener("keydown", (e:any) => {
			ignoreMouseEventCountDown = 2; // when this number becomes 0 mouse events will clear keyboard selection
			handleKeyDown(e);
		}, false);


        /**
         * Adds a listener for mouse move events. A mouse move event will cause the currently-selected item to be
         * deselected
         */
		window.addEventListener("mousemove", (e:any) => {
        	ignoreMouseEventCountDown--;
        	if (!ignoreMouseEventCountDown) { // NB: lazy testing
	            clearSelected();
        	}
        }, true);

        /*
         * Handle key input
         */
		function handleKeyDown(e:any):void {

            var interactionTarget:any = $(Selectors.focused);

			switch(e.keyCode) {
				case Canoodle.Device.Keys.LEFT:
				case Canoodle.Device.Keys.RIGHT:
				case Canoodle.Device.Keys.UP:
				case Canoodle.Device.Keys.DOWN:
					if ($(Selectors.formfieldFocused).length > 0) {
						/* focus is on a text input box, we do not want to conflict 
						 * with navigation within the input (e.g. when typing text 
						 * and moving the caret) */
						break;
					} else if (interactionTarget.length > 0) {
						// scroll text area
						interactWithTarget();
					} else if (blockInputUntilTime < (new Date()).getTime()) {
						// move selection to new target
						updateSelected();
						update();
					}
					break;
				case Canoodle.Device.Keys.ESC:
					if (interactionTarget.length > 0) {
						// escape out of interaction target (e.g. input field or text area)
                        blurInteractionTarget()
					}
					break;
				case Canoodle.Device.Keys.ENTER:
					if (interactionTarget.length > 0) {
						if (interactionTarget.is("textarea")) break; // use ESC to get out of a text area
						/* ordinarily the same as escape if there is a selection target, 
						 * except in text areas where ENTER will be expected to create a new line */
						blurInteractionTarget();
					} else {
						// same as a mouse click
						clickSelected();
					}
					break;
			}

            function blurInteractionTarget(){
                interactionTarget.removeAttr(Attributes.focused);
                interactionTarget.attr(Attributes.selected, "true");
                interactionTarget.get().blur();
            }

            /*
             * Handle a keyboard "click" event on different widget types
             */
            function clickSelected(){
                var target:any = $(Selectors.selected);

                if (target.is(Selectors.selectable)) {
                    target.trigger("click");
                } else if (target.is(Selectors.scrollable)) {
                    target.removeAttr(Attributes.selected);
                    target.attr(Attributes.focused, "true");
                } else if (target.is(Selectors.formfield)) {
                    target.removeAttr(Attributes.selected);
                    target.attr(Attributes.focused, "true");
                    target.get().focus();
                    target.one("blur", function(){
                        interactionTarget.removeAttr(Attributes.focused);
                        interactionTarget.attr(Attributes.selected, "true");
                    });
                    e.preventDefault(); // to prevent inserting a line break on a textarea
                } else {
                    console.warn("Unhandled selection event.");
                }
            }

            /*
             * Handle keyboard interaction with different selected widget types (currently only scrolling boxes)
             */
            function interactWithTarget(){
                switch(e.keyCode) {
                    case Canoodle.Device.Keys.UP:
                        interactionTarget.get().scrollTop -= 50;
                        break;
                    case Canoodle.Device.Keys.DOWN:
                        interactionTarget.get().scrollTop += 50;
                        break;
                }
            }

            /*
             * Select a new object based on direction key input
             */
            function updateSelected(){
                var selected:any = $(Selectors.selected);

                if (selected.length == 0) {
                    var target = $(Selectors.default);
                    if (target.length == 0) {
                        target = $($(Selectors.target)[0]);
                    }
                    select2(target);
                    return;
                }

                var p1:Point = {
                    x: selected.offset().left + selected.offset().width/2,
                    y: selected.offset().top + selected.offset().height/2
                }

                var targetAngle:number;
                switch(e.keyCode) {
                    case Canoodle.Device.Keys.LEFT:
                        targetAngle = Math.PI;
                        break;
                    case Canoodle.Device.Keys.RIGHT:
                        targetAngle = 0;
                        break;
                    case Canoodle.Device.Keys.UP:
                        targetAngle = Math.PI * 3/2;
                        break;
                    case Canoodle.Device.Keys.DOWN:
                        targetAngle = Math.PI * 1/2;
                        break;
                }

                var buttons = [];
                var smallestTheta = Infinity;

                $(Selectors.target).each(function(index) {
                    var target = $(this);

                    var p2:Point = {
                        x: target.offset().left + target.offset().width/2,
                        y: target.offset().top + target.offset().height/2
                    }

                    var delta = Math.sqrt(Math.abs(p1.x-p2.x)^2 + Math.abs(p1.y-p2.y)^2);
                    if (delta == 0) return;

                    var theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                    if (theta < 0) theta += Math.PI * 2;
                    theta = theta - targetAngle;
                    if (theta > Math.PI) theta -= Math.PI * 2;
                    theta = Math.abs(theta);

                    buttons.push({
                        target: 	this,
                        theta:		theta,
                        delta:		delta
                    });

                    if (theta < smallestTheta) smallestTheta = theta;
                });

                if (smallestTheta >= Math.PI/2) return;
                var thresholdAngle = Math.PI/2;
                if (smallestTheta < Math.PI / 4) thresholdAngle = Math.PI / 4;
                if (smallestTheta < Math.PI / 16) thresholdAngle = Math.PI / 16;
                if (smallestTheta < Math.PI / 18) thresholdAngle = Math.PI / 18;

                buttons = buttons.filter(function isBigEnough(element, index, array) {
                    return (element.theta < thresholdAngle);
                });
                buttons.sort(function(a,b){return a.delta - b.delta});

                unselectedAll();
                select2($(buttons[0].target));
            }
		}


        /**
         * Updates the carousel widget
         */
        function updateCarousel() {
            var tile = $(Selectors.default).offset();
            var rail = $(Selectors.selected).parents(Selectors.carousel.rail).offset();
            var container = $(Selectors.selected).parents(Selectors.carousel.mask).offset();

            var rail_width = 0;
            var rail_height = 0;
            $(Selectors.selected).parents(Selectors.carousel.rail).children().each(function () {
                var o = $(this).offset();
                var x = (o.left - rail.left) + o.width;
                if(x > rail_width) {
                    rail_width = x;
                }
                var y = (o.top - rail.top) + o.height;
                if(y > rail_height) {
                    rail_height = y;
                }
            });

            var left;
            if(rail_width > container.width) {
                left = tile.left - rail.left;
                var pc = left / (rail_width - tile.width);
                var offset = (container.width - tile.width) * pc;
                left = left - offset;
                left = Math.round(left) * -1;
                performTransition();
            } else {
                left = (container.width / 2) - (rail_width / 2);
            }

            var top;
            if(rail_height > container.height) {
                top = tile.top - rail.top;
                var pc = top / (rail_height - tile.height);
                var offset = (container.height - tile.height) * pc;
                top = top - offset;
                top = Math.round(top) * -1;
                performTransition();
            } else {
                top = 0; // don't change vertical scroll if no need
            }

            function performTransition(){
                var ms:number = ($(Selectors.selected).parents(Selectors.carousel.rail).css("transition")) ? 500 : 0;
                $(Selectors.selected).parents(Selectors.carousel.rail).css("transition", "transform "+ms+"ms");
                $(Selectors.selected).parents(Selectors.carousel.rail).css("-webkit-transition", "-webkit-transform "+ms+"ms");
                blockInputUntilTime = (new Date()).getTime() + ms;
            }

            var translation = "translate3d(" + (left) + "px, " + (top) + "px, 0px)";
            $(Selectors.selected).parents(Selectors.carousel.rail).css("transform", translation);
            $(Selectors.selected).parents(Selectors.carousel.rail).css("-webkit-transform", translation);
        }


        export module Simulate {
            /**
             * Simulates a key stroke
             * @param keyCode An Integer indicating the keyCode to simulate
             * @param type A String indiciating type of event to fire (e.g. "keyup"). Defaults to "keydown".
             * @param ctrl A Boolean. Whether the CTRL key should be simulated as being depressed.
             * @param alt A Boolean. Whether the ALT key should be simulated as being depressed.
             * @param shift A Boolean. Whether the SHIFT key should be simulated as being depressed.
             * @param meta A Boolean. Whether the META (Windows) key should be simulated as being depressed.
             */
			export function keystroke(keyCode:number, type?:string = "keydown",
                                      ctrl:bool = false,
                                      alt:bool = false,
                                      shift:bool = false,
                                      meta:bool = false):void {
				var eventObj:any = window.document.createEvent("Events");
				eventObj.initEvent(type, true, true);
				eventObj.ctrlKey = ctrl;
				eventObj.altKey = alt;
				eventObj.shiftKey = shift;
				eventObj.metaKey = meta;
				// eventObj.keyIdentifier = null;
				eventObj.keyCode = keyCode;
				eventObj.charCode = 0;
				eventObj.which = eventObj.keyCode;
				window.dispatchEvent(eventObj); 
			}
		}

	}

}