/**
 * Glitch CORS Locations Server
 *
 * @author Zach Bruggeman
 */

var http     = require('http');
var router   = require('router')();
var all      = require('require-all');
var _        = require('lodash');

var response = require('./response');

module.exports = function (port) {
    var routes = all({
        dirname:     __dirname + '/../routes',
        filter:      /(.+)\.js$/,
        excludeDirs: /^\.(git|svn)$/
    });

    for (var route in routes) {
        routes[route](router); // that's a mouthful
    }

    var server = http.createServer(function (req, res) {
        _.extend(res, response);

        router(req, res, function () {
            res.respond(404);
        });
    }).listen(port);

    console.log('Server worker listening on ' + port);
}
