module.exports = function (router) {
    var handler = function (req, res) {
        res.respond({
            routes: {
                '/locations': 'Returns all available Glitch location TSIDs',
                '/locations/:tsid.xml': 'Return information for specified tsid in XML format',
                '/locations/:tsid.json': 'Return information for specified tsid in JSON format. Also the default when no extension is specified'
            },
            source: 'https://github.com/remixz/glitch-locations'
        });
    }

    router.get('/', handler);
}