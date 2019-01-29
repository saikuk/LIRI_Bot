require("dotenv").config();
var keys = require('./keys.js');
var axios = require("axios");
var moment = require("moment");
var fs = require('fs');          
var Spotify = require('node-spotify-api');

//get the user input

var action = process.argv[2];

// using switch to apply correct function for different user input 
switch (action) {
  case "movie-this":
    movieThis();
    break;
  
  case "concert-this":
    concertThis();
    break;
  
  case "spotify-this-song":
    spotifyThis();
    break;
  
  case "do-what-it-says":
    doWhatItSays();
    break;
  }
  


//function for movie-this
function movieThis() {

    var movieName = "Mr. Nobody";
    var args = process.argv;

    for (var i = 3; i < args.length; i++) {
        movieName = "";
        if (i > 3 && i < args.length) {
            movieName = movieName + "+" + args[i];
        }
        else {
            movieName += args[i];
        }
    };

    //console.log(movieName);
   
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    );
};



function concertThis() {
    var args = process.argv;
    var concertName = "";

    for (var i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            concertName = concertName + "+" + args[i];
        }
        else {
            concertName += args[i];
        }
    };

   axios.get("https://rest.bandsintown.com/artists/" + concertName + "/events?app_id=codingbootcamp").then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("--------------------------------------------------");
                console.log("Artist: " + response.data[i].lineup);
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date & Time: " + moment(response.data[i].datetime).format("dddd MMMM Do YYYY h:mma"));
            };
        }
    );
};


function spotifyThis() {
    var spotify = new Spotify(keys.spotify);
    var args = process.argv;
    var songName = "";

    if (args.length === 3){
        songName = "The Sign";
    };

    for (var i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            songName = songName + "+" + args[i];
        }
        else {
            songName += args[i];
        }
    };
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("--------------------------------------------------");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
};




function doWhatItSays() {

    require("dotenv").config();
    var keys = require("./keys.js");
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log(err);
        }
        
        var randomArray = data.split(",");
        var songName = randomArray[1];
        
        spotify.search({ type: 'track', query: songName }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            
            console.log("--------------------------------------------------");
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[0].preview_url); 
            console.log("Album: " + data.tracks.items[0].album.name);
        });

    });
};