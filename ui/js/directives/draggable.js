angular.module('deco').directive("decoDraggable", function () {
  return {restrict: 'A',
    scope: {
      cls: '=dragCls',
      data: '=dragData',      
      index: '=dragIndex'
    },
    link: function ($scope, element, attrs) {
      var el = element[0];
      
      el.draggable = true;

      el.addEventListener(
              'dragstart',
              function (e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('startIndex',$scope.index);
                e.dataTransfer.setData('Data', JSON.stringify($scope.data));
                $('.tt-schema-drop-zone').addClass('display');
                $scope.$apply();
                $(el).addClass($scope.cls);
                return false;
              },
              false
              );

      el.addEventListener(
              'dragend',
              function (e) {
                $(el).removeClass($scope.cls);
                // $scope.set = null;
                return false;
              },
              false
              );
    }
  };
});