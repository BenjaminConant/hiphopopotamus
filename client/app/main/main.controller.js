'use strict';

angular.module('hiphopopotamusApp')
  .controller('MainCtrl', function($scope, $http, lyricFindFactory, text) {
    $scope.awesomeThings = [];
    $scope.term = "";
    var oAudio = document.getElementById('myaudio');
    oAudio.src = '../../beat.mp3';

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', {
        name: $scope.newThing
      });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.lyrics = "Yeah, this album is dedicated to all the teachers that told me I'd never amount to nothin', to all the people that lived above the buildings that I was hustlin' in front of that called the police on me when I was just tryin' to make some money to feed my daughter, and all the niggas in the struggle, you know what I'm sayin'?  Uh-ha, it's all good baby bay-bee, uh";
    var oldRap = "body like that American dream it But I Ain't picked a baby. it I go for my road too many cars do you fuckin' nation Standing at the Good life so, amazing So amazing, So amazing (Verse) My name of day we are about to find your team, I got a secret code So, hard to tease us our income tax We hear 'em back when they don't know I at every time, she went to experience something better than Just a field where we Take my life it we trying to tell by my best friend showed up and she'll have missed it breeze, yo pussy, bitch, I'm sky high I'm new wardrobe And my head would try to heartbreak <b>Grand Budapest Hotel</b>, Fresh fruits, <b>percentage points</b> And my people say fuck out the house around Like N.Y., summertime (Chi- ahh Now I got the first. time And my <b>Google survey</b> on the first year that <b>Imitation Game</b> I don't need want it But If You ever told ya love locked Down? girl, go for the goalies in keep ya love locked down, man world is, a gold digger, <i>(When I'm, sky Yes, I went to it I feel like Michael with the <b>best picture</b> it again. like <b>prediction markets</b> is the Fuck was a champion in that the sky gotta leave)</i> get it Into the style up We are about to kick it better, faster makes us we don't act like I guess Me So I <i>never</i> told ya told ya love locked down so aroused what they Don't really give or not lovin You gonna touch the way. this time, where's the fuck it past 25 but Every worthless word we seein' cop lights) street. <b>American Sniper</b>, in My road he deserve an ass at home, with this Is the day we rollin' with 30 rocks, the minimum wage? And You bogus I I need you ever, promised tomorrow today, and sharin jeans. if you can see this time I I got to be home, baby. mama hopped in love like I'm 7:00, That's if I <i>never</i> told me and my furs is my bravado DJ's need a <b>box-office returns</b>' out of the spot <b>Google Consumer Surveys</b> cars I Don't tell anybody. You All Falls down now keep it on sheets I would even pronounce nothing from you will you Want it ain't sayin' you"
    var utterance = new SpeechSynthesisUtterance(oldRap);
    window.speechSynthesis.speak(utterance);

    // window.speechSynthesis.speak($scope.lyrics)
    // $.speak($scope.lyrics);

    $scope.search = function() {
      // oAudio.play();
      console.log("hello", $scope.term)
      text.search($scope.term).success(function(articleKeywords) {
        console.log(articleKeywords);

        lyricFindFactory.success(function(data) {
          console.log(data);
          var rap = data.rap;
          data.keywords.forEach(function(keyword, index) {
            // console.log('index:', index);
            var re = new RegExp(keyword.text, 'g');

            rap = rap.replace(re, '<b>' + articleKeywords[index].text + '</b>');
          })
          console.log(rap);
          $scope.rap = rap;
          var utterance = new SpeechSynthesisUtterance(rap);
          window.speechSynthesis.speak(utterance);
          // Initialize speech synthesis, we use polyfill only when speech synthesis is not available
          var fallbackSpeechSynthesis = window.getSpeechSynthesis();
          var fallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance();

          // To use polyfill directly call
          // var fallbackSpeechSynthesis = window.speechSynthesisPolyfill;
          // var fallbackSpeechSynthesisUtterance = window.SpeechSynthesisUtterancePolyfill;

          var u = new fallbackSpeechSynthesisUtterance(rap);
          u.lang = 'en-US';
          u.volume = 1.0;
          u.rate = 1.0;
          u.onend = function(event) {
            console.log('Finished in ' + event.elapsedTime + ' seconds.');
          };
          fallbackSpeechSynthesis.speak(u);

        });



      });
    };


  });