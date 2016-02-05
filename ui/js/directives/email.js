angular.module('deco').directive('decoEmail',
        [function () {                  
            return {
              restrict: 'EA',
              replace: false,
              template: function (element, attrs) {                    
                return attrs.before + '@' + attrs.after;
              }
            };
          }]
        );