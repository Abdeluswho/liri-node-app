require("dotenv").config();
let request = require("request");
let fs = require("fs");
let Twitter = require("twitter");
let Spotify = require('node-spotify-api');
let keys = require("./keys.js");





//Retrieving the keys from the .env file -----------

let spotify_k = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

//collecting commands from the command line-----------
let command = process.argv[2];
let action = process.argv;
let value = "";
let datatoSave ={};
//saving data in an array for later access-----------
for (let i = 3; i < action.length; i++) {
	value = value + " " + action[i];
}
console.log(command);
console.log(value);



switch (command) {
   case "my-tweets":
      tweets();
      break;
  
   case "spotify-this-song":
     if (!value) {
     	console.log("Please! enter a song name..\n For Example:");
     	console.log("--------------------------------------\nSong: The Sign \nAlbum: The Sign (US Album) [Remastered]\nArtist: Ace of Base\nURL: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=51af4d758a4a4e64a8f5909b8e6cad93\nURI: spotify:track:0hrBpAOgrt8RXigk83LLNE\n--------------------------------")
     }else{
      spotify();

  	 }
      break;
  
   case "movie-this":
      if (!value) {
        //--------
        value = 'Mr.Nobody';
          movie();
        }else{
          movie();
        }
      break;
  
   case "do-what-it-says":

      	dothis();
      break;
  }


//functions definition:
  function tweets(){
 	client.get('statuses/user_timeline', { count: '10' }, function(error, tweets, response){
		if(error) throw error;
  		// console.log(tweets);  // The favorites.
  		for (var i = 0; i < tweets.length; i++) {

  			console.log("----------------------------------\n");
  			console.log(tweets[i].created_at);
  		 	console.log(JSON.stringify(tweets[i].text));  // Raw response object. 

  		 } 
  		
    });
}

function spotify(){
	spotify_k.search({ type: 'track', query: value || "The Sign", limit: 10}, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
		 
		 for (var i = 0; i < data.tracks.items.length; i++) {

      class songBody {
        constructor(song, album, artist, URL, URI){
          this.song = song;
          this.album = album;
          this.artist = artist;
          this.URL = URL;
          this.URI = URI;
        }
      }

       datatoSave  = new songBody(data.tracks.items[i].name, data.tracks.items[i].album.name, data.tracks.items[i].artists[0].name, data.tracks.items[i].preview_url, data.tracks.items[i].uri);
		 	  console.log(datatoSave);
        save(JSON.stringify(datatoSave));
      // data.tracks.items[i];
			 	console.log("--------------------------------------\n");
			 	console.log("Song: "+data.tracks.items[i].name); 
			 	console.log("Album: "+ data.tracks.items[i].album.name);

			 	console.log("Artist: "+data.tracks.items[i].artists[0].name);
		
			 	console.log("URL: "+data.tracks.items[i].preview_url);
			 	console.log("URI: "+data.tracks.items[i].uri);
			 	console.log("----------------------------------------");
			

		    
		 }
		
	});
}

function movie(){
  request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {
  // Parse the body of the site and recover just the imdbRating
     class MovieBody {
        constructor(title, released, rate, country, language, plot, actors ){
          this.title = title;
          this.released = released;
          this.rate = rate;
          this.country = country;
          this.language = language;
          this.plot = plot;
          this.actors = actors;
        }
      }

      datatoSave = new MovieBody(JSON.parse(body).Title, 
                        JSON.parse(body).Released, 
                        JSON.parse(body).Ratings[1].Value, 
                        JSON.parse(body).Country, 
                        JSON.parse(body).Language, 
                        JSON.parse(body).Plot, 
                        JSON.parse(body).Actors);
      console.log(datatoSave);
      save(JSON.stringify(datatoSave));
     

    console.log("---------------------------------------------");
    console.log("Results for: "+JSON.parse(body).Title);
    console.log("Released in: "+JSON.parse(body).Released);

    if (JSON.parse(body).Ratings[1]) {
      console.log("Rotten Tomatoes: "+JSON.parse(body).Ratings[1].Value);
    }else{
      console.log("Rated: "+JSON.parse(body).Ratings[0].Value);
    };
    
    console.log("Produced in: "+JSON.parse(body).Country);
    console.log("Language: "+JSON.parse(body).Language+"\n");
    console.log("*******************************************");
    console.log("Plot: \n"+JSON.parse(body).Plot);
    console.log("Actors: "+JSON.parse(body).Actors+"\n");
    console.log("*******************************************");
    // console.log(JSON.parse(body));

  }
});
}

function dothis(){
  fs.readFile("random.txt", "utf8", function(error, data) {
  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }
  // We will then print the contents of data
  console.log(data+"@Loading....");
  // Then split it by commas (to make it more readable)
  var dataArr = data.split(",");
  // We will then re-display the content as an array for later use.
  value = dataArr[1];
  spotify();
  
});
}

//Have a copy fo the console in a seperate file
function save(data){
  fs.appendFile("log.txt", data, function(err) {
  // If the code experiences any errors it will log the error to the console.
  if (err) {
    return console.log(err);
  }
  // Otherwise, it will print: 
  
});
  console.log("***--Database updated!--***");
}






