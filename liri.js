require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require("request");
var fs = require("fs");

var command = process.argv[2];
var searchTerm = " ";
for(i = 3; i < process.argv.length; i++) {
    if(i > 3 && i < process.argv.length) {
        searchTerm = searchTerm + "+" + process.argv[i];
    }else{
        searchTerm += process.argv[i];
    }
}

if(process.argv.length < 4 && command === "spotify-this-song") {
    searchTerm = "The Sign Ace of Base";
}

if(process.argv.length < 4 && command === "movie-this") {
    searchTerm = "Mr Nobody";
}


if(command === "my-tweets") {
    client.get("statuses/user_timeline", {screen_name: "blakeaaron17", count: "20"}, function(error, tweets, response) {
        if(error) throw error;
        // console.log(tweets);
        console.log("\n   Recent Tweets:\n");
        for(i = 0; i < tweets.length; i++) {
            console.log(i+1 + ". " + tweets[i].text);
            console.log("   (Tweeted: " + tweets[i].created_at.slice(0, -11) + ")\n");
        }
    })
}
var spotifyThisSong = function() {
    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        var song = data.tracks.items[0];
        // console.log(song);
        // console.log(song.artists);
        console.log("\nArtist(s):");
        var artistsArr = song.artists;
        console.log(" - " + artistsArr[0].name);
        for (j = 1; j > artistsArr.length; j++) {
            console.log(" - " + artistsArr[j].name);
        }
        console.log("\nSong Title:\n - " + song.name);
        console.log("\nPreview Link:\n - " + song.preview_url);
        console.log("\nAlbum:\n - " + song.album.name);
    })
}

if(command === "spotify-this-song") {
    spotifyThisSong();
}

if(command === "movie-this") {
    var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        if(!error && response.statusCode === 200) {
            var movieJSON = JSON.parse(body);
            console.log("\nTitle:\n - " + movieJSON.Title +
                "\n\nYear:\n - " + movieJSON.Year +
                "\n\nCountry:\n - " + movieJSON.Country +
                "\n\nLanguage:\n - " + movieJSON.Language +
                "\n\nPlot:\n - " + movieJSON.Plot +
                "\n\nActors:\n - " + movieJSON.Actors);
            for(i = 0; i < movieJSON.Ratings.length; i++) {
                if(movieJSON.Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("\nRotten Tomatoes Rating:\n - " + movieJSON.Ratings[i].Value);
                }
                if(movieJSON.Ratings[i].Source === "Internet Movie Database") {
                    console.log("\nIMDB Rating:\n - " + movieJSON.Ratings[i].Value);
                }
            }
        }
    })
}

if(command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        // console.log(data);
        var dataArr = data.split(",");
        // console.log(dataArr);
        if(dataArr[0] === "spotify-this-song") {
            searchTerm = dataArr[1];
            spotifyThisSong();
        }
    })
}