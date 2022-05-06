require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
    // Our routes go here:
    app.get('/', (req, res) => res.render('index'));
    
    //Display result from search

    app.get('/search',(req,res) => {
     const { q } = req.query;
        spotifyApi
         .searchArtists(q)
         .then(data => {
           console.log('The received data from the API: ', data.body.artists.items);
           const items = data.body.artists.items;
           
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            
            res.render('artists',{items});
          })
         .catch(err => console.log('The error while searching artists occurred: ', err));

    });    
  
  
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(
    (data =>{
      const items = data.body.items;
      console.log('Artis albums:',items);
      res.render('albums', {items});
    }))
    .catch(err =>console.log('The error while searching artists occurred: ', err));
  
});



app.get('/tracks/:albumId', (req, res) => {
  
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    const item = data.body.items;
    console.log(item);
    //you always need to render an object if the data is an object is optional to use the parameters. 
    res.render("tracks", {item});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
