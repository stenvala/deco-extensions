(function (angular, undefined) {
  
  angular.module('deco').directive('decoRoutePath',
          ['$location', '$routeParams', 'deco.nav',
            function ($location,
                    $routeParams,
                    decoNav) {
              return {
                restrict: 'E',
                templateUrl: 'deco.routePath',
                scope: {
                  params: '=routeParams'
                },
                link: function ($scope, element, attrs) {

                  var links = decoNav.getNavigation();

                  $scope.path = $location.path();

                  $scope.linkStack = [];
                                    
                  $scope.showLast = !('hideLast' in attrs);
                  
                  var setLinkStack = function (links, base) {
                    for (var i = 0; i < links.length; i++) {
                      var fullPath = base + links[i].PageSchema.path;
                      var title = null;
                      for (var key in $routeParams) {
                        var rpRef = new RegExp('/:' + key + '$');
                        if (fullPath.match(rpRef) != null) {
                          fullPath = fullPath.replace(rpRef, '/' + $routeParams[key]);
                          if ($scope.params != undefined && key in $scope.params) {
                            title = $scope.params[key];
                          }
                          break;
                        }
                      }
                      var reg = new RegExp('^' + fullPath);
                      if ($scope.path.match(reg) != null) {
                        if (fullPath == $scope.path) {
                          if (title != null) {
                            links[i].PageSchema.title = title;
                          }
                          $scope.linkStack.push(links[i]);
                          return;
                        } else {
                          $scope.linkStack.push(links[i]);
                          setLinkStack(links[i].Children, fullPath);
                        }
                      }
                    }
                  };
                  setLinkStack(links, '');

                  $scope.$watch('params', function (newVal, oldVal) {
                    $scope.linkStack = [];
                    setLinkStack(links, '');                    
                  }, true);
                  
                }
              };
            }]);
          
})(angular);