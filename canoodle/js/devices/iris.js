var Canoodle;
(function(e){(function(b){b.name="Digisoft Iris";b.Keys={LEFT:37,RIGHT:39,UP:38,DOWN:40,SPACE:32,ENTER:13,DELETE:8,TAB:9,ESC:65296};var c=new WebSocket("ws://localhost:80","digibrowser_websock");c.onopen=function(a){};c.onclose=function(a){};c.onmessage=function(a){a=a.data.split("\n");for(var d=0;d<a.length;d++){var b=a[d].split("=")[0],c=a[d].split("=")[1];""!=b&&e.Debugger.log("Key: "+b+", Val: "+c)}};c.onerror=function(a){};(function(a){a.open=function(a,b){}})(b.Browser||(b.Browser={}))})(e.Device||
(e.Device={}))})(Canoodle||(Canoodle={}));
