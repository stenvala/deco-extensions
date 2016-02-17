angular.module('deco').directive('decoNavLinks',
        ['$location', function ($location) {
            return {
              restrict: 'E',
              templateUrl: 'deco.navLinks',
              scope: {
                links: '=links',
                doesFit: '=doesFit'
              },
              link: function ($scope, element, attrs) {
                $scope.type = attrs.type;
                // redirect to new path
                $scope.goto = function (path) {
                  $('.sublinks').removeClass('show');
                  $location.path(path);
                };

                // is current path active
                $scope.isActive = function (linkPath) {
                  var match = $location.path().match('^' + linkPath);
                  if (match != null && match[0] == linkPath) {
                    return true;
                  }
                  return false;
                }

                // activated when main link extender is clicked
                $scope.toggleSubLinksIn = function (event) {
                  var el = event.currentTarget;
                  event.stopPropagation();
                  var sublinks = $(el).parent().parent().children()[1];
                  if ($(sublinks).hasClass('show')) {
                    $(sublinks).removeClass('show');
                  }
                  else {
                    $(sublinks).addClass('show');
                  }
                }

                // has sublinks
                $scope.showAny = function (collection) {
                  for (var key in collection) {
                    if (collection.hasOwnProperty(key) &&
                            collection[key].Schema.isActive &&
                            collection[key].Schema.showInIndex) {
                      return true;
                    }
                  }
                  return false;
                }

                // to test main link action icon if sublinks are opened, fix this
                // use element to determine, this is only ng-class related thing
                $scope.areSublinksOpened = function (index) {
                  var sublinks = $(element).find('.sublinks')[index];                    
                  return $(sublinks).hasClass('show');
                }
              }
            };
          }]);