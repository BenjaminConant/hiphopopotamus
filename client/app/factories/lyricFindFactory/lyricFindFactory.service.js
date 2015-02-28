'use strict';

angular.module('hiphopopotamusApp')
  .factory('lyricFindFactory', function($http) {


    return $http.get('/api/lyrics/');
     
  });