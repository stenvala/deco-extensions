angular.module('deco').directive("decoCanvasFollowMouse", function() {
  return {restrict: 'A',
    scope: {fun: '=decoCanvasFollowMouse'},
    link: function($scope, element, attrs) {
      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
      element[0].addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(element[0], evt);
        $scope.fun(mousePos.x, mousePos.y);
      }, false);
    }
  };
});

