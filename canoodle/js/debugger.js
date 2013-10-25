var Canoodle;
(function(c){(function(e){var d=null,f=!1;e.start=function(a,b){"undefined"===typeof a&&(a="127.0.0.1");"undefined"===typeof b&&(b=4200);a="http://"+a+":"+b;c.Utils.execute(a+"/socket.io/socket.io.js");d=io.connect(a);d.on("connect",function(){f=!0})};e.log=function(a,b){"undefined"===typeof b&&(b="INFO");if(f){var c={jsonrpc:"2.0",method:"log",params:{type:b.toString().toUpperCase(),data:a}};d.emit("Debugger",c)}else console.warn("Canoodle: Attempt to connect to Debugger socket when socket is not connected.")}})(c.Debugger||(c.Debugger=
{}))})(Canoodle||(Canoodle={}));
