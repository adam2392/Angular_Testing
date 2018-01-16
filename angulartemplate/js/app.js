/* The model for the data entry pages. Helps link controller with the html
 * and tells the ng-view where to look for the html rendering.
 *
 */

angular.module('DataEntry', [
  'ngRoute'
]).config(function ( $routeProvider ) {
  $routeProvider
    .when('/instructions', {
      templateUrl: 'views/instructions.html',
      controller: 'MainCtrl'
    })
    .when('/sus', {
      templateUrl: 'views/sus.html',
      controller: 'MainCtrl'
    })
    .when('/vineland', {
      templateUrl: 'views/vineland.html',
      controller: 'MainCtrl'
    })
    .when('/rist', {
      templateUrl: 'views/rist.html',
      controller: 'MainCtrl'
    })
    .when('/scq', {
      templateUrl: 'views/scq.html',
      controller: 'MainCtrl'
    })
    .when('/srs2', {
      templateUrl: 'views/srs2.html',
      controller: 'MainCtrl'
    })
    .when('/brief', {
      templateUrl: 'views/brief.html',
      controller: 'MainCtrl'
    })
    .when('/triadchild', {
      templateUrl: 'views/triadchild.html',
      controller: 'MainCtrl'
    })
    .when('/triadparent', {
      templateUrl: 'views/triadparent.html',
      controller: 'MainCtrl'
    })
});
