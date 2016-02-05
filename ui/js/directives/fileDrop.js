(function(angular, undefined) {

  angular.module('deco').directive("decoFileDrop", function() {
    return {restrict: 'A',
      scope: {
        onDrop: '=onDrop',
        onDragover: '=onDragOver',
        onDragleave: '=onDragLeave',
        param: '=dropParam'
      },
      link: function($scope, element, attrs) {
        if ($scope.param == undefined) {
          $scope.param = {};
        }
        element[0].addEventListener('dragover', function(evt) {
          evt.preventDefault();
          if ($scope.onDragover != undefined) {
            $scope.onDragover(element[0], $scope.param);
          }
        }, false);
        element[0].addEventListener('dragleave', function(evt) {
          evt.preventDefault();
          if ($scope.onDragleave != undefined) {
            $scope.onDragleave(element[0], $scope.param);
          }
        }, false);
        element[0].addEventListener('drop', function(evt) {
          evt.preventDefault();
          if ('fileDropZoneMultiple' in attrs) {
            $scope.onDrop(evt.dataTransfer.files, element[0], $scope.param);
          }
          else {
            $scope.onDrop(evt.dataTransfer.files[0], element[0], $scope.param);
          }
        }, false);
      }
    };
  });

})(angular);