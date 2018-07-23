require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

if(command === "my-tweets") {
    client.get("statuses/user_timeline", {screen_name: "blakeaaron17", count: "20"}, function(error, tweets, response) {
        if(error) throw error;
        
    })
}