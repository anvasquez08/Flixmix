const db = require('../database/db.js');
const helpers = require('../helpers/helpers.js');
const movieModels = require('../models/movies.js');
const Promise = require('bluebird');

module.exports = {
  addMoviesToDatabaseAndCreatePlaylist: (req, res) => {

    let shortURL, playlistID; 
    let {movieArr, user_id} = req.body;
    let arrayOfMovieValues = movieArr.map((object) =>  Object.values(object))
    let arrayOfMovieTitles = movieArr.map((object) =>  object.original_title)

    movieModels.createUniqueURL()
    .then((url) => {
      shortURL = url;
      return movieModels.insertMoviesIntoMovieTable(arrayOfMovieValues)
    })
    .then(() => movieModels.insertPlaylistURLintoPlaylistTable(shortURL, user_id))
    .then((idOfPlaylist) => {
      playlistID = idOfPlaylist
      return movieModels.selectMovieIdsFromMovieTable(arrayOfMovieTitles)
    })
    .then((arrayOfMovieIds) => {
      return movieModels.insertPlaylistWithMovieIdsIntoPlaylistMovieTable(arrayOfMovieIds, playlistID)
    })
    .then(() => res.send())
    .catch(err => res.send(err))
    .catch(err => res.send(err))
    .catch(err => res.send(err))
    .catch(err => res.send(err))
  }
}


// CLIENT JSON DATA

// JSON DATA:
// { "user_id": 2,
//   "movieArr": [{
//   "poster_path": "Test", 
//   "release_date": "Test", 
//   "original_title": "test", 
//   "popularity": "test"
// }, 
// {
//   "poster_path": "Test1", 
//   "release_date": "Test1", 
//   "original_title": "test1", 
//   "popularity": "test1"
// }]}
