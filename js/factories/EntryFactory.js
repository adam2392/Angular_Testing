/**
 * Factory: InboxFactory
 */
angular.module('DataEntry')
  .factory('EntryFactory', function EntryFactory ($q, $http, $location) {
    'use strict';
    var exports = {};

    exports.getMessages = function () {
      return $http.get('json/data.json')
        .error(function (data) {
          console.log('There was an error!', data);
        });
    };
    return exports;
  });
