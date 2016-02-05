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
          var reset = function () {
            var width = $('nav').width();
            if (width != hiddenForScreenWidth) {
              hidden = [];
              allGoneThrough = false;
              hiddenForScreenWidth = width;
              $scope.anyHidden = false;
            }
          };

          $(window).resize(function () {
            setTimeout(function () {
              if (!$scope.$$phase) {
                $scope.$apply(reset);
              }
            }, 1000);
          });

          reset();

          $scope.doesFit = function (el, type) {
            if ($window.innerWidth < 1025) {
              return true;
            }
            if (type == 'extended') {
              return !$scope.doesFit(el, 'main');
            }
            else if (type != 'main') {
              return true;
            }
            else if (hiddenForScreenWidth == $('nav').width() &&
                    hidden.indexOf(el.$index) != -1) {
              return false;
            }
            else if (hiddenForScreenWidth == $('nav').width() &&
                    allGoneThrough) {
              return true;
            }
            var children = $('nav .mainlinks-container .mainlink-container');
            var child = children[el.$index];
            if ((el.$index + 1) == children.length) {
              allGoneThrough = true;
            }            
            if ($(child).offset().top > 10) {
              if (hidden.indexOf(el.$index) === -1) {
                hidden.push(el.$index);
              }
              $scope.anyHidden = true;
              return false;
            } else {
              if (hidden.indexOf(el.$index) === -1) {
                hidden.splice(el.$index, 1);
              }
            }
            return true;
          }
        }
      }
    }
  ]);

}());