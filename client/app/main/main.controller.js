'use strict';

angular.module('hiphopopotamusApp')
  .controller('MainCtrl', function ($scope, $http, lyricFindFactory, text) {
    $scope.awesomeThings = [];
    $scope.term = "";
    $scope.rap = '';

    lyricFindFactory.success(function(data) {
          console.log(data);
          var rap = data.rap
          




          $scope.rap = rap;
        });
    
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
    
    $scope.lyrics = "Yeah, this album is dedicated to all the teachers that told me I'd never amount to nothin', to all the people that lived above the buildings that I was hustlin' in front of that called the police on me when I was just tryin' to make some money to feed my daughter, and all the niggas in the struggle, you know what I'm sayin'?  Uh-ha, it's all good baby bay-bee, uh";
    
    $scope.search = function() {
      console.log("hello", $scope.term)
      text.search($scope.term);
    };
                      
                     
  });
