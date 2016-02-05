angular.module('deco').directive('decoDroppable', function () {
  return {
    scope: {
      cls: "=dropCls",
      index: "=dropIndex",      
      cb: "=dropCallback"
    },
    link: function ($scope, element) {
      var el = element[0];
      el.addEventListener(
              'dragover',
              function (e) {
                e.dataTransfer.dropEffect = 'move';
                if (e.preventDefault) {
                  e.preventDefault();
                }
                this.classList.add($scope.cls);
                return false;
              },
              false
              );

      el.addEventListener(
              'dragenter',
              function (e) {
                $(el).addClass($scope.cls);
                return false;
              },
              false
              );

      el.addEventListener(
              'dragleave',
              function (e) {
                $(el).removeClass($scope.cls);
                return false;
              },
              false
              );

      el.addEventListener(
              'drop',
              function (e) {                
                // Stops some browsers from redirecting.
                if (e.stopPropagation) {
                  e.stopPropagation();
                }

                $(el).removeClass($scope.cls);                

                var startIndex = e.dataTransfer.getData('startIndex');
                var data = JSON.parse(e.dataTransfer.getData('Data'));
                $scope.cb($scope.index, startIndex, data);

                return false;
              },
              false
              );
    }
  }
});
