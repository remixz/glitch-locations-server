var fs = require('fs');
var parser = require('./parser');

function Locations () {
    var self = this;
    self.storage = Object.create(null);
    self.files = fs.readdirSync(__dirname + '/../locations/');

    for (var i = 0; i < self.files.length; i++) {
        self.files[i] = self.files[i].replace('.xml', '');
    }
}

Locations.prototype.all = function () {
    return this.files;
}

Locations.prototype.get = function (tsid, type) {
    if (typeof this.storage[tsid] === 'undefined' || typeof this.storage[tsid][type] === 'undefined') return this.set(tsid, type);
    return this.storage[tsid][type];
}

Locations.prototype.set = function (tsid, type) {
    var self = this;
    var file = fs.readFileSync(__dirname + '/../locations/' + tsid + '.xml', {encoding: 'utf-8'});
    this.storage[tsid] = {};
    if (type === 'json') {
        parser.convertFile(file, function (data) {
            self.storage[tsid][type] = data;
        });
    } else {
        self.storage[tsid][type] = file;
    }

    return this.storage[tsid][type];
}

module.exports = new Locations();
