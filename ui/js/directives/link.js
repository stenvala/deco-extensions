angular.module('deco').directive('decoLink',
        ['$location', '$rootScope', function ($location, $rootScope) {
            return {
              restrict: 'AE',
              scope: {
                param: '=param'
              },
              link: function ($scope, element, attrs) {                
                var extUrl = function (url) {
                  if ('target' in attrs) {
                    window.open(url, attrs.target);
                  }
                  else {
                    window.open(url);
                  }
                };
                
                if ('str' in attrs){
                  $scope.param = attrs.str;
                }
                
                var clickfun = function () {
                  if ('url' in attrs) {
                    extUrl(attrs.url);
                    return;
                  }
                  else if ('route' in attrs) {
                    $location.path(attrs.route);
                    return;
                  }
                  else if ('routeAdd' in attrs) {
                    $location.path($location.path() + $scope.param);
                    return;
                  }
                  else if ('routeReverse' in attrs) {                                        
                    var exp = $location.path().split('/');                    
                    var path = "";                          
                    for (var i=0; i<=$scope.param; i++){                      
                      path += '/' + exp[i+1];                      
                    }
                    $location.path(path);
                    return;
                  }
                  else if (attrs.decoLink.match('@://@') != '') {
                    extUrl(attrs.decoLink);
                    return;
                  }
                  else {
                    $location.path(attrs.decoLink);
                  }
                };
                var applyFun = function () {
                  $rootScope.$apply(clickfun);
                };
                // add click
                element.bind('tap click', applyFun);
                $(element).addClass('hand');
                if (!('noClass' in attrs)) {
                  $(element).addClass('deco-link');
                }
              }
            };
          }]
        );