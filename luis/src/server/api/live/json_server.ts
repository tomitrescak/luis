export function startServer(processMessage: any, port = 9838) {
  var net = require('net');
  var JsonSocket = require('json-socket');

  var server = net.createServer();
  server.listen(port);
  server.on('connection', function(socket: any) {
    //This is a standard net.Socket
    socket = new JsonSocket(socket); //Now we've decorated the net.Socket to be a JsonSocket
    socket.on('message', function(message: any) {
      processMessage(message);
    });
  });

  // start websocket

  const WebSocket = require('ws');

  const wss = new WebSocket.Server({ port: 9839 });

  wss.on('connection', function connection(ws: any) {
    console.log('connected');

    ws.on('message', function incoming(message: any) {
      if (message) {
        var parsed = JSON.parse(message);
        processMessage(parsed);
      }
    });
  });
}
