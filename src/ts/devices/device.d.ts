module Canoodle.Device {
    var name: string;
    var Keys: {
        LEFT: number;
        RIGHT: number;
        UP: number;
        DOWN: number;
        SPACE: number;
        ENTER: number;
        DELETE: number;
        TAB: number;
        ESC: number;
    };
    module Browser {
        function open(url:string, showToolbar? : bool): void;
    }
}
