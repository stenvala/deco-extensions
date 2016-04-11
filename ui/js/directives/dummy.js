angular.module('deco').directive('decoDummy',
        [function () {
            return {
              restrict: 'E',
              template: '<ng-transclude></ng-transclude>',
              transclude: true
            };
          }]
        );