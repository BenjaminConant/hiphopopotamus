'use strict';

var _ = require('lodash');
var Lyric = require('./lyric.model');
var request = require('request');
var cheerio = require('cheerio');
var markov = require('markov');
var q = require('q');

var api = require('../../../api');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(api.alchemy);

var kanye = {
  "artist": "Kanye West",
  "albums": [{
    "album": "The College Dropout",
    "year": "2004",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20The%20College%20Dropout",
    "songs": ["Intro", "We Don't Care", "Graduation Day", "All Falls Down", "I'll Fly Away", "Spaceship", "Jesus Walks", "Never Let Me Down", "Get Em High", "Workout Plan", "The New Workout Plan", "Twista:Slow Jamz", "Breathe In, Breathe Out", "School Spirit Skit 1", "School Spirit", "School Spirit Skit 2", "Lil Jimmy Skit", "2 Words", "Through The Wire", "Family Business", "Last Call"]
  }, {
    "album": "Late Registration",
    "year": "2005",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20Late%20Registration",
    "songs": ["Wake Up Mr. West", "Heard 'Em Say", "Touch The Sky", "Gold Digger", "Skit Number 1", "Drive Slow", "My Way Home", "Crack Music", "Roses", "Bring Me Down", "Addiction", "Skit Number 2", "Diamonds From Sierra Leone (Remix)", "We Major", "Skit Number 3", "Hey Mama", "Celebration", "Skit Number 4", "Gone", "Diamonds From Sierra Leone", "Late", "We Can Make It Better"]
  }, {
    "album": "Graduation",
    "year": "2007",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20Graduation",
    "songs": ["Good Morning", "Champion", "Stronger", "I Wonder", "Good Life", "Can't Tell Me Nothing", "Barry Bonds", "Drunk & Hot Girls", "Flashing Lights", "Everything I Am", "The Glory", "Homecoming", "Big Brother", "Bittersweet Poetry", "Can't Tell Me Nothing", "Good Night"]
  }, {
    "album": "808s & Heartbreak",
    "year": "2008",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20808s%20&%20Heartbreak",
    "songs": ["Say You Will", "Welcome To Heartbreak", "Heartless", "Amazing", "Love Lockdown", "Paranoid", "RoboCop", "Street Lights", "Bad News", "See You In My Nightmares", "Coldest Winter", "Pinocchio Story (Live)"]
  }, {
    "album": "My Beautiful Dark Twisted Fantasy",
    "year": "2010",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20My%20Beautiful%20Dark%20Twisted%20Fantasy",
    "songs": ["Dark Fantasy", "Gorgeous", "Power", "All Of The Lights (Interlude)", "All Of The Lights", "Monster", "So Appalled", "Devil In A New Dress", "Runaway", "Hell Of A Life", "Blame Game", "Lost In The World", "Who Will Survive In America", "See Me Now"]
  }, {
    "album": "Yeezus",
    "year": "2013",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20Yeezus",
    "songs": ["On Sight", "Black Skinhead", "I Am A God", "New Slaves", "Hold My Liquor", "I'm In It", "Blood On The Leaves", "Guilt Trip", "Send It Up", "Bound 2"]
  }, {
    "album": "Watch The Throne",
    "year": "2011",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Jay-Z%20&%20Kanye%20West%20Watch%20The%20Throne",
    "songs": ["Jay-Z & Kanye West:No Church In The Wild", "Jay-Z & Kanye West:Lift Off", "Jay-Z & Kanye West:Niggas In Paris", "Jay-Z & Kanye West:Otis", "Jay-Z & Kanye West:Gotta Have It", "Jay-Z & Kanye West:New Day", "Jay-Z & Kanye West:That's My Bitch", "Jay-Z & Kanye West:Welcome To The Jungle", "Jay-Z & Kanye West:Who Gon Stop Me", "Jay-Z & Kanye West:Murder To Excellence", "Jay-Z & Kanye West:Made In America", "Jay-Z & Kanye West:Why I Love You"]
  }, {
    "album": "Late Orchestration",
    "year": "2006",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20Late%20Orchestration",
    "songs": ["Diamonds From Sierra Leone", "Touch The Sky", "Crack Music", "Drive Slow", "Through The Wire", "Workout Plan", "Heard 'Em Say", "All Falls Down", "Bring Me Down", "Gone", "Late", "Jesus Walks", "Gold Digger"]
  }, {
    "album": "VH1 Storytellers",
    "year": "2010",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20VH1%20Storytellers",
    "songs": ["See You In My Nightmares", "RoboCop", "Flashing Lights", "Amazing", "Touch The Sky", "Say You Will", "Good Life", "Heartless", "Stronger"]
  }, {
    "album": "Chi Town Classic, Volume 2",
    "year": "2003",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20Chi%20Town%20Classic,%20Volume%202",
    "songs": ["Slow Jam", "Love You Better", "Nappy Roots:These Walls", "Wouldn't You Like To Ride", "One More For Me", "The Way That U Do", "Never Let Me Down", "Stand Up (Remix)", "You Know", "Jay-Z:Lucifer", "Girls Girls Girls", "Through The Wire (Remix)", "Rock The Mic Freestyle", "Get By (Remix)", "Heavy Hitters", "Keep The Receipt", "Excuse Me Again, Part 3", "How We Chill In 03", "Let's Get Married"]
  }, {
    "album": "Freshmen Adjustment",
    "year": "2005",
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye%20West%20Freshmen%20Adjustment",
    "songs": ["Intro", "Doing Fine", "Self Conscious", "Gossip Files", "Wack Niggaz", "I Need To Know", "Out Of Your Mind", "Livin' In A Movie", "Drop Dead Gorgeous", "Wow", "Apologize", "Hey Mama", "The Good, The Bad And The Ugly", "Keep The Receipt", "Heavy Hitters", "My Way", "Home", "'03 Electric Relaxation", "All Falls Down", "Through The Wire (Remix)"]
  }, {
    "album": "Mixtapes",
    "year": null,
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye_West%20Mixtapes",
    "songs": ["Friday Morning (Intro)", "Stronger (Snippet)", "Can't Tell Me Nothing", "Porno (Interlude)", "Young Folks", "Interviews (Interlude)", "Throw Some D's", "Throw Some D's (Spoof Remix)", "Intro", "Jay-Z:Girls, Girls, Girls (Remix)", "Chaka Khan:Through The Fire", "Through The Wire (Remix)", "Whole City Behind Us", "Keep The Receipt", "Jay-Z:Izzo (H.O.V.A.)", "Jin:I Gotta Love", "Jesus Walks", "Jesus Walks (Remix)", "Drop Dead Gorgeous", "Half Price", "Last Night", "All Falls Down", "Gossip Files", "John Legend:Used To Love U", "Get Em High", "A Million Freestyle", "Is That Your Car", "Wouldn't You Like To Ride", "Consequence:So Soulful", "Electric Relaxation 2003", "Hey Mama", "Livin' In A Movie", "Freestyle", "Mase:Be Alright (Welcome Back Remix)", "Better Than Yours", "Spaceship", "Workout Plan (Remix)", "Outro", "This Way", "We Can't Tell", "Arguments", "Selfish", "Classic", "Drive Slow (T.I. Remix)", "Whole Life", "Drive Slow (Remix)", "Wheely Shit", "Magic Man", "Flight School", "What It Is"]
  }, {
    "album": "Songs Featuring Kanye West",
    "year": null,
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye_West%20Songs%20Featuring%20Kanye%20West",
    "songs": ["John Legend:All Falls Down", "Stromae:Alors On Danse", "Estelle:American Boy", "Patti LaBelle:Anything", "Ghostface Killah:Back Like That", "Madonna:Beat Goes On", "Ne-Yo:Because Of You", "Michael Jackson:Billie Jean", "Nicki Minaj:Blazin'", "Rhymefest:Brand New", "T-Pain:Buy U A Drank (Shawty Snappin')", "Chris Brown:Deuces", "Jamie Foxx:Digital Girl", "Cam'ron:Down And Out", "Katy Perry:E.T.", "Kid Cudi:Erase Me", "Fonzworth Bentley:Everybody", "Jamie Foxx:Extravaganza", "DJ Felli Fel:Finer Things", "Drake:Forever", "N.A.S.A.:Gifted", "Common:Go!", "DJ Khaled:Go Hard", "DJ Khaled:Grammy Family", "Do Or Die:Higher", "Dwele:Hold On", "Thirty Seconds To Mars:Hurricane 2.0", "Keyshia Cole:I Changed My Mind", "Teriyaki Boyz:I Still Love H.E.R.", "Clipse:Kinda Like A Big Deal", "Keri Hilson:Knock You Down", "DJ Clue:Like This", "Rick Ross:Live Fast, Die Young", "Kid Cudi:Make Her Say", "Big Sean:Marvin & Chardonnay", "Rick Ross:Maybach Music 2", "Janet Jackson:My Baby", "John Legend:Number One", "Pharrell Williams:Number One", "Really Doe:Plastic", "Kid Sister:Pro Nails", "Young Jeezy:Put On", "Rell:Real Love", "Jay-Z:Run This Town", "Slum Village:Selfish", "Twista:Slow Jamz", "Lloyd Banks:Start It Up", "88-Keys:Stay Up! (Viagra)", "Mr Hudson:Supernova", "T.I.:Swagga Like Us", "Brandy:Talk About Our Love", "Jay-Z:The Bounce", "Common:The Corner", "Common:The Food", "T-Pain:Therapy", "Fall Out Boy:This Ain't A Scene, It's An Arms Race", "Dilated Peoples:This Way", "The-Dream:Walkin' On The Moon", "Artists For Haiti:We Are The World 25 For Haiti", "T.I.:Welcome To The World", "Sofia Fresh:What It Is", "Consequence:Whatever You Want", "The Game:Wouldn't Get Far"]
  }, {
    "album": "Other Songs",
    "year": null,
    "amazonLink": "http:\/\/www.amazon.com\/exec\/obidos\/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=external-search%3Fsearch-type=ss%26index=music%26keyword=Kanye_West%20Other%20Songs",
    "songs": ["Kanye West & R. Kelly:To The World", "Kanye West, Big Sean, 2 Chainz & Marsha Ambrosius:The One", "Kanye West, Chief Keef, Pusha T, Big Sean & Jadakiss:Don't Like", "Kanye West, Jay-Z & Big Sean:Clique", "++Bonus TRACK++Diamonds From Sierra Leone", "A Million And One", "All Of The Lights Remix", "Amazing Grace", "Bad News (Remix)", "Bet Cypher", "Better Than I've Ever Been", "Blueprint Compilation", "Bonnie & Clyde Freestyle", "Call Some Hoes", "Can't Tell Me Nothing (Remix)", "Can't Tell Me Nothing Feat. Fabolous", "Chain Heavy", "Christian Dior Denim Flow", "Christmas In Harlem", "Cold", "Corners", "Diamond Girl", "Diamonds From Sierra Leoneemix)", "Don't Look Down", "Don't Stop", "Dreams Of F In Lil' Kim", "Dreams Of Fuckin Lil' Kim", "Ego", "Electric Relaxation", "Excuse Me Miss Again (Remix)", "Eyes Closed", "Eyez Closed", "Flashing Lights (Remix)", "Food", "Forever", "Gangsta Wannabe", "Ghetto University", "Glory", "Gold Digger (Mtv Version)", "Good Ass Job", "Good Friday", "Goodbye", "H-a-m", "H.A.M", "H\u2022a\u2022M", "Heard'em Say", "Heartless (Remix)", "Here We Go Again", "Hey Mama (Grammy Remix)", "Hey Mama (Remix)", "Hold On (Remix)", "Hot 97", "I Don't Like", "I Just Wanna Love U (Offcial Kanye West Mumtribute Mix)", "I Wanna Be Edward Cullen", "I'm The Ish", "Illest Motherf**ker Alive", "Impossible", "In The Mood", "It's Going Down", "Jesus Piece", "Jesus Walks Remix", "Jesus Walks Trilogy", "Kinda Like A Big Deal", "Knock Knock (Remix)", "Knock You Down", "Late Registration", "Let's Get Married Reception Remix", "Lift Off", "Livin'", "Looking For Trouble", "Lord Lord Lord", "Love Lockedown (Remix)", "Make Me Better", "Mama's Boyfriend", "Me Against The Music Remix", "Mercy", "Never Let Me Down - Ft. Jay Z", "New Day", "New God Flow.1", "New Workout Plan", "Ni**as In Paris", "NYC Freestyle Cypher", "Only One", "Out The Game", "Over Again", "Peace", "Poppin' Tags", "Poppin' Tags", "Power (remix)", "Power Remix", "Primetime", "Pro Nails", "Punch Drunk Love", "Runaway Part 2 Kanye West", "Say You Will (Remix)", "Slow Jams Featuring Twista & Jamie Fox", "Slow Jamz (College Dropout Remix)", "Stratosphere Of Love", "Stronger (A-Trak Remix)", "Summer Jam Freestyle", "Swagga Like Us", "Take One For The Team", "Talk About Our Love", "Tell Everybody That You Know", "That's My B**tch", "The Good, The Bad, The Ugly (Exclusive)", "The New Work Out Plan", "The New Workout Plan (Remix)", "This Ain't A Scene, It's An Arms Race", "U Ain't Neva Gotz Ask", "Unhappy", "We Major Pt 2", "Welcome Back (remix)", "Where You At?", "White Dress", "Who Gon Stop Me", "Wouldn't Get Far", "Wouldn't You Like 2 Ryde (Malik Yusef\/Kanye West & Common)", "Wouldn't You Like To"]
  }]
};
var regex = / /g;

var deferred = q.defer();

var allPromises = [];
var m = markov(1);

for (var i = 0; i < kanye.albums.length && j < 3; i++) {
  var album = kanye.albums[i];
  for (var j = 0; j < album.songs.length && j < 3; j++) { 

    var song = album.songs[j];
    allPromises.push(getLyrics(i, j));
  }
}

q.allSettled(allPromises)
  .then(function(results) {

    var allLyrics = results.reduce(reduceFn, '');
    console.log('all promises resolved!');
    // console.log(allLyrics);

    m.seed(allLyrics, function() {
      console.log('done seeding');
      deferred.resolve();
    });
  });

// Get list of lyrics
exports.index = function(req, res) {

  // var time = 0;
  // setTimeout(function() {
  //   console.log('timeout worked!')
  // }, 1000)
  // var interval = setInterval(function() {
  //   console.log(time++, ' seconds');
  // }, 1000);


  // clearInterval(interval);

  deferred.promise.then(function() {


    var retRap = '';
    var word = m.pick();
    var nextObj;
    retRap += word;
    nextObj = m.next(word);
    if (nextObj) {

      word = nextObj.word;
    } else {
      word = m.pick();
    }
    retRap += ' ' + word;
    for (var i = 0; i < 600; i++) {
      nextObj = m.next(nextObj.key);
      if (!nextObj || !nextObj.word) {
        word = m.pick();
      } else {
        word = nextObj.word
      }
      retRap += ' ' + word;
    }

    // console.log(retRap);
    alchemy.keywords(retRap, {
      apikey: api.alchemy,
      maxRetrieve: 10
    }, function(err, response) {
      if (err) throw err;

      // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
      var keywords = response.keywords;

      return res.json(200, {rap: retRap, keywords: keywords});
      // Do something with data
    });



  })


  // Lyric.find(function(err, lyrics) {
  //   if (err) {
  //     return handleError(res, err);
  //   }
  //   return res.json(200, lyrics);
  // });
};

function reduceFn(prev, curr) {
  var next = prev;
  if (curr.state !== 'fulfilled') return next;
  return next + ' ' + curr.value;
}

function getLyrics(albumIdx, songIdx) {

  var deferred = q.defer();

  request.get('http://lyrics.wikia.com/api.php?func=getSong&artist=' + kanye.artist.replace(regex, '_') + '&song=' + kanye.albums[albumIdx].songs[songIdx].replace(regex, '_') + '&fmt=realjson',
    function(error, response, body) {
      if (!error) {
        // console.log(albumIdx, ', ', songIdx, ' completed');
        var url = JSON.parse(body).url;
        // console.log('url retrieved:', url);
        request.get(url,
          function(error, response, body) {
            // console.log('cheerio acquired:', body);
            var $ = cheerio.load(body);
            var html = $('.lyricbox').html();
            if (!html) return deferred.reject(new Error('no html here?'));
            html = html.replace(/<br>/g, '\n');
            var text = html.replace(/<script>.*<\/script>/g, '');
            text = text.replace(/<!--[\w\W]*-->/g, '');
            text = text.replace(/<div.*<\/div>/g, '');
            text = text.replace(/&apos;/g, '\'');
            text = text.replace(/&amp;/g, '&');
            text = text.replace(/\[.*\]/g, '');

            deferred.resolve(text);
          })
      } else {
        console.log(albumIdx, ', ', songIdx, ' failed!');
        deferred.reject(error);
      }
    });

  return deferred.promise;
}


// Get a single lyric
exports.show = function(req, res) {
  Lyric.findById(req.params.id, function(err, lyric) {
    if (err) {
      return handleError(res, err);
    }
    if (!lyric) {
      return res.send(404);
    }
    return res.json(lyric);
  });
};

// Creates a new lyric in the DB.
exports.create = function(req, res) {
  Lyric.create(req.body, function(err, lyric) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, lyric);
  });
};

// Updates an existing lyric in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Lyric.findById(req.params.id, function(err, lyric) {
    if (err) {
      return handleError(res, err);
    }
    if (!lyric) {
      return res.send(404);
    }
    var updated = _.merge(lyric, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, lyric);
    });
  });
};

// Deletes a lyric from the DB.
exports.destroy = function(req, res) {
  Lyric.findById(req.params.id, function(err, lyric) {
    if (err) {
      return handleError(res, err);
    }
    if (!lyric) {
      return res.send(404);
    }
    lyric.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}