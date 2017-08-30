var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

EventsProvider = function(host, port) {
  this.db= new Db('node-mongo-github-events', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


EventsProvider.prototype.getCollection= function(callback) {
  this.db.collection('events', function(error, events_collection) {
    if( error ) callback(error);
    else callback(null, events_collection);
  });
};

EventsProvider.prototype.save = function(event, callback) {
    this.getCollection(function(error, events_collection) {
      if( error ) callback(error)
      else {
        events_collection.insert(event, function() {
          callback(null, event);
        });
      }
    });
};

exports.EventsProvider = EventsProvider;