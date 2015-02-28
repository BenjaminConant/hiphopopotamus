'use strict';

angular.module('hiphopopotamusApp')
  .factory('text', function($http) {
    return {
      search: function(searchTerm) {
        console.log('search...')
        return $http.post('api/texts/search', {
          searchTerm: searchTerm
        }).success(function(text) {
          console.log(text);
        }).error(function(err) {
          console.log(err);
        });
      }
    };
  });