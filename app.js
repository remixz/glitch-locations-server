var cluster = require('cluster');
var os      = require('os');

var server  = require('./lib/server.js');

var port = process.env.PORT || 8080;

if (cluster.isWorker) return server(port);
for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}

cluster.on('exit', function (worker, code) {
    console.log('Worker ' + worker.process.pid + ' died, returning code ' + code);
    cluster.fork();
});

