'use strict';

angular.module('hiphopopotamusApp')
  .factory('lyricFindFactory', function($http) {


    return function() {


      $http.get('/api/lyrics/')
        .success(function(data) {
          console.log(data);
        })
    };






  });