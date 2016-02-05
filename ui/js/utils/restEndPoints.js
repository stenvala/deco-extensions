(function(self, undefined) {
  // rest endpoints  
  var ep = {
  };

  var get = function(endpoint, parameters) {
    if (arguments.length == 2) {
      var value = ep[endpoint];
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          var search = ':' + key;
          var match = value.match(search);
          if (match) {
            value = value.replace(search, parameters[key]);
          }
        }
      }
      return value;
    }
    return ep[endpoint];
  };
  var set = function(endpoint, uri) {
    ep[endpoint] = uri;
  };

  self.restEndPoints = {
    get: get,
    set: set
  };
}(window.deco = window.deco || {}));