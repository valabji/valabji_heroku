const PORT = process.env.PORT || 80;
console.log("Valabji Port is " + PORT)
/* 
const NetcatServer = require('netcat/server')
const NetcatClient = require('netcat/client')
const nc = new NetcatServer()
const nc2 = new NetcatClient()

nc.port(PORT).k().listen().on('data', function (rinfo, data) {
    console.log('Got', data.toString(), 'from', rinfo)
    nc2.addr('google.com').port(80).connect()
    nc.proxy(nc2.stream())
}) */

var http = require('http');
// var console = console;

server = http.createServer(function (request, response) {
    console.log(request.connection.remoteAddress + ": " +
        request.method + " " +
        request.url);

    var proxy = http.createClient(80, request.headers['host']);

    var proxy_request = proxy.request(request.method, request.url,
        request.headers);

    proxy_request.addListener('response', function (proxy_response) {
        proxy_response.addListener('data', function (chunk) {
            // sys.log("response: " + chunk);
            response.write(chunk, 'binary');
        });

        proxy_response.addListener('end', function () {
            response.end();
        });

        response.writeHead(proxy_response.statusCode,
            proxy_response.headers);
    });

    // prevent connection reset from killing the process
    request.socket.removeAllListeners('error');

    request.addListener('data', function (chunk) {
        console.log("request: " + chunk);
        proxy_request.write(chunk, 'binary');
    });
    request.addListener('end', function () {
        proxy_request.end();
    });
    request.socket.addListener('error', function (err) {
        console.error("error occured in request socket\n");
        console.inspect(err);
    });


});

server.listen(PORT);

process.addListener("unhandledException", function (err) {
    console.error("something bad happened!\n");
    console.inspect(err);
    console.error("restarting server");
    server.listen(PORT);
});