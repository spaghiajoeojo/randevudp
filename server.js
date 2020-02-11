var udp = require('dgram');
var uuid = require('uuid/v1');
// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');
var peers = {};

// emits when any error occurs
server.on('error', function (error) {
    console.log('Error: ' + error);
    server.close();
});

// emits on new datagram msg
server.on('message', function (msg, info) {
    console.log('Data received from client : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
    var addr = `${info.address}:${info.port}`;
    var response = addr;
    var stringMsg = msg.toString();
    if (stringMsg.toString() === 'KEEP') {
        response = "OK";
        var peer = {
            id: uuid(),
            addr: addr,
            time: Date.now()
        };
        setTimeout(() => {
            delete peers[addr];
        }, 30000);
        peers[addr] = peer;
    } else if (stringMsg.toString() === 'GET') {
        response = JSON.stringify(peers);
    }

    //sending msg
    server.send(response, info.port, 'localhost', function (error) {
        if (error) {
            console.error(error);
            client.close();
        } else {
            console.log('Response sent.');
        }

    });

});

//emits when socket is ready and listening for datagram msgs
server.on('listening', function () {
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);
});

//emits after the socket is closed using socket.close();
server.on('close', function () {
    console.log('Socket is closed !');
});

server.bind(2222);