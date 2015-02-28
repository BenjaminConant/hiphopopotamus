'use strict';

var _ = require('lodash');
var Text = require('./text.model');
var cheerio = require('cheerio');
var request = require('request');
var api = require('../../../api.js');
console.log(api.alchemy);


exports.search = function(req, res) {
  var NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904";
  var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=source:("The New York Times") AND type_of_material:("News")' + '&q='+req.body.searchTerm.replace(' ', '+')+'&page=1&api-key=' + NYTapiKey;
  request(url, function(err,responce,body) {
  console.log(responce);
  var data = JSON.parse(responce.body);
  var docs = data.response.docs;
  var urls = [];

  docs.forEach(function(doc){
    urls.push(doc.web_url)
  });




  console.log(urls);
  // var send = responce.body.docs[0];
  return res.json(200, responce);
  });
};









// Get list of texts
exports.index = function(req, res) {
  Text.find(function (err, texts) {
    if(err) { return handleError(res, err); }
    return res.json(200, texts);
  });
};

// Get a single text
exports.show = function(req, res) {
  Text.findById(req.params.id, function (err, text) {
    if(err) { return handleError(res, err); }
    if(!text) { return res.send(404); }
    return res.json(text);
  });
};

// Creates a new text in the DB.
exports.create = function(req, res) {
  Text.create(req.body, function(err, text) {
    if(err) { return handleError(res, err); }
    return res.json(201, text);
  });
};

// Updates an existing text in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Text.findById(req.params.id, function (err, text) {
    if (err) { return handleError(res, err); }
    if(!text) { return res.send(404); }
    var updated = _.merge(text, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, text);
    });
  });
};

// Deletes a text from the DB.
exports.destroy = function(req, res) {
  Text.findById(req.params.id, function (err, text) {
    if(err) { return handleError(res, err); }
    if(!text) { return res.send(404); }
    text.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}