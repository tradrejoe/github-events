'use strict';
var request = require('request');
const util = require('util');
require('./events.provider');
var dt = require('./date.js');
var eventsProvider = new EventsProvider('localhost', 27017);
var dt = require('./date.js');

module.exports = function(accessToken) {
    var options = {
        url: 'https://api.github.com/events',
        headers: {
            'User-Agent': 'GHHR',
            'Authorization': 'token ' + accessToken,
            'If-None-Match': '""'
        }
    };
    var log = {
        ratelimit: {
            limit: 5000,
            remaining: 0,
            reset: 0
        },
        events: 0,
        requests: 0
    };
    return {

        filter: function(events) {
            var out = [];
            var processed = new Map();
            for (var i=0; i< events.length;i++) {
                var e = events[i];
                if ((e.public || e.public=="true") && !processed.get(e.id)) {
                    console.log("pushing event " + e.id);
                    out.push(e);
                    processed.set(e.id, 1);
                    //save to mongodb for commits with microsoft.com email
                    if (typeof e.payload !== 'undefined' && e.payload &&
                        typeof e.payload.commits !== 'undefined' && e.payload.commits &&
                        typeof e.payload.commits.email !== 'undefined' && e.payload.commits.email &&
                            e.payload.commits.email.indexOf("@microsoft.com")>-1) {
                        try {
                            eventsProvider.save(e, null);
                        } catch(e) {
                            console.log(e);
                        }
                    }
                } else {
                    console.log("dup event, id=" + e.id + ",type=" + e.type);
                    //console.log(util.inspect(e, true, null));
                }
            }
            return out;
        },
        getEvents: function(socket) {
            //log.requests += 1;
            console.log("getting github events... ");
            var mgr = this;
            request(options, function(error, response, body) {
                if(error) {
                    console.error(error);
                } else if(response.statusCode === 304) {
                    console.log("github events api return status 304, executing callback...");
                } else if(response.statusCode === 200) {
                    var events = JSON.parse(body);
                    //parseInfo(response.headers, events);
                    console.log("github events api return status 200, events=");
                    socket.broadcast.emit("github-events", mgr.filter(events));
                    socket.broadcast.emit("github-time", dt.getCurrUTCDateISO());
                } else {
                    console.log("response.statusCode=" + response.statusCode + "body=");
                    console.log(util.inspect(body, true, null));
                }
            });
        }
    };
};
