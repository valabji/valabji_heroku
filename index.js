const PORT = process.env.PORT || 880;
console.log("Valabji Port is " + PORT)

const NetcatServer = require('netcat/server')
const NetcatClient = require('netcat/client')
const nc = new NetcatServer()
const nc2 = new NetcatClient()

nc.port(PORT).k().listen().on('data', function (rinfo, data) {
    console.log('Got', data.toString(), 'from', rinfo)
    nc2.addr('google.com').port(80).connect()
    nc.proxy(nc2.stream())
})