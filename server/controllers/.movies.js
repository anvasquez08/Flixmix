const db = require('../database/db.js');
const helpers = require('../helpers/helpers.js');

module.exports = {
  addMoviesToDatabaseAndCreatePlaylist: (req, res) => {
    // ** PENDING FUNCTION TO GENERATE BITLY LINK WITH LIST OF ORIGINAL MOVIES
    let url = 'https://bit.ly/2uFTHHc' //temp link
    let {movieArr, user_id} = req.body;
    let arrayOfMovieValues = movieArr.map((object) =>  Object.values(object))
    let arrayOfMovieTitles = movieArr.map((object) =>  object.original_title).join()



    let queryAddMoviesToMoviesTable = 'INSERT INTO movies (poster_path, release_date, original_title, popularity) VALUES ?';
    db.connection.query(queryAddMoviesToMoviesTable, [arrayOfMovieValues], (err, data) => {
      if (err) {res.status(404).end()} 
        else {

        console.log( '1) DATA WAS SAVED [Avengers, Avengers 2]' , data)

        let queryAddURLToPlaylistTable = 'INSERT INTO playlist (url, users_users_id) VALUES (?, ?)';
        db.connection.query(queryAddURLToPlaylistTable, [url, user_id], (err, data) => {
          if (err) {res.status(404).end()} 
          else {
          let playlistID = data.insertId;

          console.log('2) URL WAS SAVED [user_id": 72]', data)

            let queryToSelectMovieIds = `SELECT movies_id FROM movies WHERE original_title = ?`;
            db.connection.query(queryToSelectMovieIds, [arrayOfMovieTitles], (err, data) => {
            if (err) { res.status(404).end()} 
              else {

              // let movieAndPlaylistArray = helpers.mapPlaylistIDtoMovieID(playlistID, data)
              console.log('these are the 2 movie ID', data)


              res.send('done')
              // let queryToAddMovieIDandPlaylistID = 'INSERT INTO movies_playlists (movies_movies_id, playlist_playlist_id) VALUES ?';
              // db.connection.query(queryToAddMovieIDandPlaylistID, [movieAndPlaylistArray], (err, data) => {
              //   if (err) {res.status(404).end()} 
              //     else {
              //     res.send(data)
              //   }
              // })
            }
          })
          }
        })
      }
    })
  }
}

// 182  82
// 192  82


/*

CLIENT JSON DATA

JSON DATA:
{ "user_id": 2,
  "movieArr": [{
  "poster_path": "Test", 
  "release_date": "Test", 
  "original_title": "test", 
  "popularity": "test"
}, 
{
  "poster_path": "Test1", 
  "release_date": "Test1", 
  "original_title": "test1", 
  "popularity": "test1"
}]}


*/