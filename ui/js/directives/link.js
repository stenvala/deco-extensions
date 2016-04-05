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

                if ('str' in attrs) {
                  $scope.value = attrs.str;
                } else {
                  $scope.value = $scope.param;
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
                    $location.path($location.path() + $scope.value);
                    return;
                  }
                  else if ('routeReverse' in attrs) {                    
                    var exp = $location.path().split('/');                    
                    var path = "";                                        
                    for (var i = 1; i < (exp.length - parseInt($scope.value)); i++) {
                      path += '/' + exp[i];
                    }
                    if ('and' in attrs) {
                      path += '/' + $scope.and;
                    }
                    $location.path(path);
                    return;
                  }
                  else if ('routeSibling') {
                    var exp = $location.path().split('/');
                    exp[exp.length - 1] = $scope.value;
                    $location.path(exp.join('/'));
                    console.log(attrs);
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