(function (angular, deco, undefined) {

  angular.module('deco').directive('decoFigureEditor',
          ['toaster', 'deco.$http', function (toaster, $http) {
              return {
                restrict: 'E',
                templateUrl: 'deco.figureEditor',
                scope: {
                  onSave: '=save',
                  onCancel: '=cancel',
                  id: '=canvasId'
                },
                link: function ($scope, element, attrs) {
                  $scope.show = 'loading';
                  $scope.type = 'per';
                  $scope.prefix = true;
                  // Init figure drawing when editFigure event is launched
                  $scope.$on('decoFigureEditor', function (evt, data) {
                    if ($scope.show != 'loading') {
                      return;
                    }                    
                    $scope.fe = new deco.figureEditor({
                      canvas: $(element).find('canvas')[0],
                      maxWidth: 1000,
                      maxHeight: 700
                    });
                    $scope.figure = data.figure;
                    $scope.params = data.params;
                    $scope.fe.drawFullImage($scope.figure, function () {
                      $scope.show = 'loaded';
                      $scope.$apply();
                    });
                    $scope.params.name = $scope.figure.name;
                  });
                  $scope.cancel = function () {
                    $scope.show = 'loading';
                    $scope.onCancel();
                  };
                  $scope.mousePosition = function (x, y) {
                    $scope.mouse = {x: x, y: y};
                    $scope.$apply();
                  };
                  $scope.recordMouseClick = function () {
                    // add also possibility to change perspeection                  
                    $scope.setCropPoint();
                  };
                  $scope.saveToServer = function () {
                    $scope.show = 'uploading';
                    var fd = new FormData();
                    fd.append('file', $scope.figure);
                    fd.append('resize', $scope.params.resize);
                    fd.append('name', $scope.params.name);
                    fd.append('prefix', $scope.prefix);
                    fd.append('crop', JSON.stringify($scope.fe.getCropPoints()));
                    var def = $http.post(deco.restEndPoints.get('upload'), fd, {
                      withCredentials: true,
                      headers: {'Content-Type': undefined},
                      transformRequest: angular.identity
                    });
                    def.then(function (reply) {
                      if (reply.status == 200) {
                        toaster.pop('success', 'OK', 'Kuva ladattu palvelimelle onnistuneesti.');
                        $scope.show = 'uploaded';
                        var text = '<img src="' + reply.data.relPath + '">';
                        if ($scope.type == 'par') {
                          text = '<p>\n' + text + '\n</p>';
                        }
                        else if ($scope.type == 'per') {
                          text = '<p>\n' +
                                 '  <figure>\n' + 
                                 '    ' + text + '\n' +
                                 '     <figcaption></figcaption>\n' + 
                                 '  </figure>\n' + 
                                 '</p>';
                        }
                        $scope.onSave(reply, $scope.params, text);
                        $scope.show = 'loading';
                      }
                      else {
                        console.log(reply);
                      }
                    })
                  };
                  $scope.setCropPoint = function () {
                    $scope.fe.setCropPoint($scope.mouse.x, $scope.mouse.y);
                  };
                }
              };
            }
          ]);

})(angular, deco);