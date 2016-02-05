angular.module('deco').directive('decoRoot', ['$rootScope',
  function ($rootScope) {
    return {restrict: 'A',
      link: function ($scope, element, attrs) {
        $scope.root = $rootScope;
      }
    };
  }]
        );