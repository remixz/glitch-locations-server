var http = require('http');

var res = module.exports = {
    __proto__: http.ServerResponse.prototype
};

res.respond = function (data, xml) {
    var response = data;

    if (typeof data === 'object') response = JSON.stringify(data, null, 4);
    if (typeof data === 'number') response = JSON.stringify({error: data});

    if (xml) {
        var contentType = 'application/xml; charset=utf-8'
    } else {
        var contentType = 'application/json; charset=utf-8'
    }

    this.writeHead(typeof data === 'number' ? data : 200, {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(response, 'utf8'),
        'Access-Control-Allow-Origin': '*'
    });

    this.end(response);
}
