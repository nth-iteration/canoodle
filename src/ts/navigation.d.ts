module Canoodle.Navigation {
    function select(el: any): void;
    function getSelected(): any;
    function clearSelected():void;
    function update(): void;
	module Simulate {
		function keystroke(keyCode:number, type?:string):void;
	}
}
