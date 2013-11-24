var locations = require('../lib/locations');

module.exports = function (router) {
    var handler = function (req, res) {
        if (!req.params.tsid) {
            res.respond(locations.all());
        } else if (req.params.tsid) {
            var split = req.params.tsid.split('.');

            if (locations.all().indexOf(split[0]) === -1) return res.respond(404);

            if (split[1] && split[1] === 'xml' || split[1] === 'json') {
                var type = split[1];
            } else {
                var type = 'json';
            }

            var data = locations.get(split[0], type);
            res.respond(data, (type === 'xml' ? true : false));
        } else {
            res.respond(404);
        }
        
    }

    router.get('/locations', handler);
    router.get('/locations/{tsid}', handler);
}