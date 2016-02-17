angular.module('deco').directive('decoSubRoutes',
        ['$location', 'deco.nav', 
          function ($location,           
          decoNav) {
            return {
              restrict: 'E',
              templateUrl: 'deco.subRoutes',
              scope: {                
              },
              link: function ($scope, element, attrs) {
                
                var links = decoNav.getNavigation();
                
                $scope.path = $location.path();
                                                
                var getSublinks = function(links, base){                  
                  for (var i=0;i<links.length;i++){                    
                    var fullPath = base + links[i].Schema.path;                    
                    var reg = new RegExp('^' + fullPath);
                    if ($scope.path.match(reg) != null){
                      if (links[i].Contents.length == 0){
                        return [];
                      } else if (fullPath == $scope.path){
                        return links[i].Contents;
                      } else {
                        return getSublinks(links[i].Contents,fullPath);
                      }
                    }                    
                  }
                  return [];                  
                };                                
                
                $scope.sublinks = getSublinks(links,'');                
                
              }
            };
          }]);