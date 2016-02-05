(function (angular, undefined) {
  var that = {
    navigation: null,
    adminNavigation: null
  };

  angular.module('deco').service('deco.nav', function () {
    this.setNavigation = function (nav) {
      that.navigation = nav;
    };
    this.setAdminNavigation = function(nav){
      that.adminNavigation = nav;
    };
    this.getNavigation = function () {
      return that.navigation;
    };
    this.getAdminNavigation = function () {
      return that.adminNavigation;
    };
  });
    
})(angular);