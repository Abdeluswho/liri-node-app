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
      movie();
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


