// Parser by @revdancatt - https://github.com/revdancatt/CAT422-glitch-location-viewer
// This is pretty much just the CoffeeScript version converted, with some minor tweaks to convertFile to callback the JSON
// @todo - Rewrite in normal JS

var convert, xml2js;

xml2js = require('xml2js');

convert = module.exports = {
  convertFile: function(file, callback) {
    var parser;
    parser = new xml2js.Parser();

    return parser.parseString(file, function(err, dataJSON) {
      var locationJSON;
      locationJSON = convert.getBaseInformation(dataJSON);
      locationJSON.gradient = convert.getGradient(dataJSON);
      locationJSON.dynamic = convert.getBaseDimensions(dataJSON);
      locationJSON.dynamic.layers = convert.getLayers(dataJSON);

      callback(locationJSON)
    });

  },
  getBaseInformation: function(dataJSON) {
    var locationJSON;
    locationJSON = {};
    locationJSON.tsid = dataJSON.game_object.$.tsid;
    locationJSON.label = dataJSON.game_object.$.label;
    return locationJSON;
  },
  getGradient: function(dataJSON) {
    var colour, dynamic, item, result, _i, _j, _len, _len1, _ref;
    result = {};
    dynamic = dataJSON.game_object.object[0].object;
    for (_i = 0, _len = dynamic.length; _i < _len; _i++) {
      item = dynamic[_i];
      if (item.$.id === 'gradient') {
        if ('str' in item) {
          _ref = item.str;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            colour = _ref[_j];
            result[colour.$.id] = colour._;
          }
        }
      }
    }
    return result;
  },
  getBaseDimensions: function(dataJSON) {
    var dynamic, item, result, _i, _len;
    result = {};
    dynamic = dataJSON.game_object.object[0].int;
    for (_i = 0, _len = dynamic.length; _i < _len; _i++) {
      item = dynamic[_i];
      result[item.$.id] = parseInt(item._, 10);
    }
    return result;
  },
  getLayers: function(dataJSON) {
    var d, dynamic, item, layer, layers, result, _i, _j, _k, _len, _len1, _len2, _ref;
    dynamic = dataJSON.game_object.object[0].object;
    result = {};
    for (_i = 0, _len = dynamic.length; _i < _len; _i++) {
      item = dynamic[_i];
      if (item.$.id === 'layers') {
        layers = item.object;
        for (_j = 0, _len1 = layers.length; _j < _len1; _j++) {
          layer = layers[_j];
          result[layer.$.id] = {};
          if ('str' in layer && layer.str.length > 0) {
            result[layer.$.id].name = layer.str[0]._;
            if ('int' in layer) {
              _ref = layer.int;
              for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                d = _ref[_k];
                result[layer.$.id][d.$.id] = parseInt(d._, 10);
              }
              result[layer.$.id].filters = convert.getFilters(layer.object);
              result[layer.$.id].decos = convert.getDecos(layer.object);
              result[layer.$.id].signposts = convert.getSignposts(layer.object);
              /*
                                          result[layer.$.id].walls = convert.getWalls(layer.object)
                                          result[layer.$.id].boxes = convert.getBoxes(layer.object)
                                          result[layer.$.id].doors = convert.getDoors(layer.object)
                                          result[layer.$.id].ladders = convert.getLadders(layer.object)
                                          result[layer.$.id].platformLines = convert.getPlatformLines(layer.object)
                                          result[layer.$.id].targets = convert.getTargets(layer.object)
              */

            }
          }
        }
      }
    }
    return result;
  },
  getFilters: function(layer) {
    var element, filter, result, _i, _j, _len, _len1, _ref;
    result = {};
    for (_i = 0, _len = layer.length; _i < _len; _i++) {
      element = layer[_i];
      if (element.$.id === 'filtersNEW' || element.$.id === 'filters') {
        if ('object' in element) {
          _ref = element.object;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            filter = _ref[_j];
            if ('int' in filter && filter.int.length > 0) {
              result[filter.$.id] = parseInt(filter.int[0]._);
            }
          }
        }
      }
    }
    return result;
  },
  getDecos: function(layer) {
    var deco, element, name, newDeco, position, result, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3;
    result = [];
    for (_i = 0, _len = layer.length; _i < _len; _i++) {
      element = layer[_i];
      if (element.$.id === 'decos') {
        if ('object' in element) {
          _ref = element.object;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            deco = _ref[_j];
            newDeco = {};
            if ('str' in deco) {
              _ref1 = deco.str;
              for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                name = _ref1[_k];
                if (name.$.id === 'sprite_class') {
                  newDeco.filename = name._;
                }
              }
            }
            if ('int' in deco) {
              _ref2 = deco.int;
              for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
                position = _ref2[_l];
                newDeco[position.$.id] = parseInt(position._, 10);
              }
            }
            if ('bool' in deco) {
              _ref3 = deco.bool;
              for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {
                value = _ref3[_m];
                newDeco[value.$.id] = value._ === 'true';
              }
            }
            result.push(newDeco);
          }
        }
      }
    }
    return result;
  },
  getSignposts: function(layer) {
    var b, connection, element, i, newConnection, newSignpost, position, result, s, signpost, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    result = [];
    for (_i = 0, _len = layer.length; _i < _len; _i++) {
      element = layer[_i];
      if (element.$.id === 'signposts') {
        if ('object' in element) {
          _ref = element.object;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            signpost = _ref[_j];
            newSignpost = {};
            newSignpost.name = signpost.$.id;
            _ref1 = signpost.int;
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              position = _ref1[_k];
              newSignpost[position.$.id] = parseInt(position._, 10);
            }
            newSignpost.connects = [];
            if ('object' in signpost && signpost.object.length > 0 && 'object' in signpost.object[0]) {
              _ref2 = signpost.object[0].object;
              for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
                connection = _ref2[_l];
                newConnection = {};
                if ('bool' in connection) {
                  _ref3 = connection.bool;
                  for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {
                    b = _ref3[_m];
                    if (b._ === 'true') {
                      newConnection[b.$.id] = true;
                    }
                    if (b._ === 'false') {
                      newConnection[b.$.id] = false;
                    }
                  }
                }
                if ('int' in connection) {
                  _ref4 = connection.int;
                  for (_n = 0, _len5 = _ref4.length; _n < _len5; _n++) {
                    i = _ref4[_n];
                    newConnection[i.$.id] = parseInt(i._, 10);
                  }
                }
                if ('str' in connection) {
                  _ref5 = connection.str;
                  for (_o = 0, _len6 = _ref5.length; _o < _len6; _o++) {
                    s = _ref5[_o];
                    if (s.$.id !== 'swf_file_versioned') {
                      newConnection[s.$.id] = s._;
                    }
                  }
                }
                if ('objref' in connection) {
                  newConnection.label = connection.objref[0].$.label;
                  newConnection.tsid = connection.objref[0].$.tsid;
                }
                newSignpost.connects.push(newConnection);
              }
            }
            result.push(newSignpost);
          }
        }
      }
    }
    return result;
  }
};