(function () {

  var hidden = [];
  var hiddenForScreenWidth = 0;
  var allGoneThrough = false;

  angular.module('deco').directive('decoNav', ['$window',
    '$rootScope',
    'deco.nav',
    function ($window, $rootScope, decoNav) {
      return {restrict: 'A',
        scope: '@',
        link: function ($scope, element, attrs) {
          $scope.root = $rootScope;
          $scope.links = decoNav.getNavigation();
          $scope.adminLinks = decoNav.getAdminNavigation();
          $scope.anyHidden = false;
          $scope.dummy = true;

          $scope.doesFit = function (el, type) {
            if ($window.innerWidth < 1025 || type != 'extended') {
              return true;
            }
            var offset = $($('.mainlinks-container .mainlink')[el]).offset();
            if (offset.top > 0) {
              $scope.anyHidden = true;
            }
            return offset.top > 0;
          };

          // auto follow hidden data
          var w = angular.element($window);
          w.bind('resize', function () {
            $scope.anyHidden = false;
            $scope.$apply();
          });
          //        
        }
      };
    }
  ]);

}());