angular.module('deco').directive('decoRouteSiblings',
        ['$location', 'deco.nav',
          function ($location,
                  decoNav) {
            return {
              restrict: 'E',
              templateUrl: 'deco.routeSiblings',
              scope: {
              },
              link: function ($scope, element, attrs) {

                var links = decoNav.getNavigation();
                $scope.path = $location.path();

                var getSublinks = function (links, base) {
                  for (var i = 0; i < links.length; i++) {
                    var fullPath = base + links[i].PageSchema.path;
                    var reg = new RegExp('^' + fullPath);
                    if ($scope.path.match(reg) != null) {
                      if (fullPath == $scope.path) {
                        // now get siblings of this
                        var siblings = [];
                        for (var j = 0; j < links.length; j++) {                          
                          if (links[j].PageSchema.isActive &&
                                  links[j].PageSchema.id != links[i].PageSchema.id) {
                            siblings.push(links[j]);
                          }
                        }
                        return siblings;
                      } else {
                        return getSublinks(links[i].Children, fullPath);
                      }
                    }
                  }
                  return [];
                };

                $scope.getSibling = function(url){
                  return url.substring(1);
                };

                $scope.links = getSublinks(links, '');

              }
            };
          }]);