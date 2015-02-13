/* The model for the data entry pages
 *
 *
 */

angular.module('DataEntry', [
  'ngRoute'
]).config(function ( $routeProvider ) {
  'use strict';
  $routeProvider
    .when('/instructions', {
      templateUrl: 'views/instructions.html',
      controller: 'PageCtrl'
    })
    .otherwise({
      redirectTo: '/instructions'
    });
});
