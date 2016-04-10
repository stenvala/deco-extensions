// hides ans shows elements based on utc time stamps given to attributes show-from and hide-at
angular.module('deco').directive('decoHideTime',
        [function () {
            return {
              restrict: 'EA',
              replace: false,
              transclude: true,
              scope: {},
              template: '<ng-transclude ng-show="show"></ng-transclude>',
              link: function ($scope, element, attrs) {
                // read timestamp from value passed via attribute
                var getTime = function (value) {
                  var regex = new RegExp(/^([0-9]*)-([0-9]*)-([0-9]*)\s([0-9]*):([0-9]*):([0-9]*)$/);
                  var val = value.match(regex);
                  if (!val) {
                    console.log('Time "' + value + '" does not match timestamp based regular expression.');
                    return new Date(); // return now, if 
                  }
                  var t = new Date();
                  t.setUTCFullYear(parseInt(val[1]));
                  t.setUTCMonth(parseInt(val[2]) - 1);
                  t.setUTCDate(parseInt(val[3]));
                  t.setUTCHours(parseInt(val[4]));
                  t.setUTCMinutes(parseInt(val[5]));
                  t.setUTCSeconds(parseInt(val[6]));
                  return t.getTime();
                };
                //
                $scope.show = true;
                if ('showFrom' in attrs) {
                  var time = getTime(attrs.showFrom);
                  if (time > new Date().getTime()) {
                    $scope.show = false;
                  }
                }
                //                
                if ($scope.show && 'hideAt' in attrs) {
                  var time = getTime(attrs.hideAt);
                  if (time < new Date().getTime()) {
                    $scope.show = false;
                  }
                }
                //
              }
            };
          }]
        );