angular.module('deco').directive('decoToggle',
        function() {
          return {restrict: 'A',
            scope: '@',
            link: function($scope, element, attrs) {              
              element.bind('click', function(event) {                
                // toggle
                if ('element' in attrs) {
                  var elements = attrs.element;
                  var classes = attrs.toggleClass;
                  var ar = elements.split(',');
                  var arCls = classes.split(',');
                  for (var i = 0; i < ar.length; i++) {
                    var el = ar[i];
                    var cls;
                    if (arCls.length == ar.length) {
                      cls = arCls[i];
                    }
                    else {
                      cls = classes;
                    }
                    if ($(el).hasClass(cls)) {
                      $(el).removeClass(cls);
                    }
                    else {
                      $(el).addClass(cls);
                    }
                  }
                }
                // remove elements                
                if ('elementRemove' in attrs) {                  
                  var elements = attrs.elementRemove;
                  var classes = attrs.removeClass;
                  var ar = elements.split(',');
                  var arCls = classes.split(',');
                  for (var i = 0; i < ar.length; i++) {
                    var el = ar[i];
                    var cls;
                    if (arCls.length == ar.length) {
                      cls = arCls[i];
                    }
                    else {
                      cls = classes;
                    }
                    if ($(el).hasClass(cls)) {
                      $(el).removeClass(cls);
                    }                    
                  }
                }
                //
              });
            }
          };
        }
);
