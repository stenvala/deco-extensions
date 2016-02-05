/* Bind ctrl-* and Enter keys to element (like input)
 * 
 * example:
 * deco-bind-keys="enter|ctrl-s|ctrl-z"
 * bind-keys-enter="pressEnter"
 * bind-keys-ctrl-s="pressCtrlAndSSimultaneously"
 * bind-keys-ctrl-z="clickedAnotherMetaThing"
 * Given bind function is called with triggered event
 */

angular.module('deco').directive('decoBindKeys', function () {
  return {restrict: 'A',
    link: function ($scope, element, attrs) {
      var bind = 'bindTo' in attrs ? attrs.bindTo : 'keydown';        
      $(element)[bind](function (evt) {                
        // ctrl-*
        var meta = attrs.decoBindKeys.match(/ctrl-[a-z]/);
        if (meta && (evt.metaKey || evt.ctrlKey)) {                    
          var ch = meta[0][5];                
          if (String.fromCharCode(evt.which).toLowerCase() === ch) {                        
            $scope[attrs['bindKeysCtrl' + ch.toUpperCase()]](evt);
            evt.preventDefault();
          }
        }
        // element
        else if (evt.which === 13 && attrs.decoBindKeys.match(/enter/)){
            $scope[attrs.bindKeysEnter](evt);
            evt.preventDefault();
        }
        else { 
          // evt.preventDefault();          
        }
      });
    }
  };

});
