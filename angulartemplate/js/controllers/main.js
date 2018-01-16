/**
 * Controller: PageCtrl
 * Description: Controls the ng-view section within index.html and 
 * provides functionality for clicking within the navbar.
 */
angular.module('DataEntry')
  .controller('MainCtrl',
    function MainCtrl ( $scope, $location ) {
      'use strict';
      $scope.ChangeView = function(view) {
      	$location.path(view);
      }
    });