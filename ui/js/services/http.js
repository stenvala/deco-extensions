(function (angular, undefined) {

  var headers = {};

  angular.module('deco').service('deco.$http',
          ['$http', '$q', function ($http, $q) {
              
              var persistHeader = function (header, value) {
                headers[header] = value;
              };
              
              var removeHeader = function(header) {
                delete headers[header];
              };

              var promise = function (url, method, data) {
                var def = $q.defer();
                if (arguments.length < 2) {
                  method = 'get';
                }
                var obj = {
                  method: method,
                  url: url,
                  headers: {}
                };
                if (arguments.length > 2 && data !== null) {
                  obj.data = data;
                }
                // add headers                
                for (var key in headers){                  
                  if (headers.hasOwnProperty(key)){
                    obj.headers[key] = headers[key];
                  }                  
                }
                $http(obj).
                        success(function (data, status, headers, config) {
                          var reply = {
                            data: data,
                            status: status,
                            headers: headers,
                            config: config
                          };
                          def.resolve(reply);
                        }).
                        error(function (data, status, headers, config) {
                          var reply = {
                            data: data,
                            status: status,
                            headers: headers,
                            config: config
                          };
                          def.resolve(reply);
                        });
                return def.promise;
              };
              var get = function (url) {
                return promise(url);
              };
              var del = function (url) {
                return promise(url, 'delete');
              };
              var post = function (url, data) {
                return promise(url, 'post', data);
              };
              var put = function (url, data) {
                return promise(url, 'put', data);
              };
              return {
                removeHeader: removeHeader,
                persistHeader: persistHeader,
                custom: promise,
                get: get,
                del: del,
                post: post,
                put: put
              };
            }
          ]);

}(angular));