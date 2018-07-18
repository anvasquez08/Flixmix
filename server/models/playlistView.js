const db = require('../database/db.js');


//takes in in playlist url and geths the playlist id
function fetchPlaylistId(playlistUrl, callback) {
  db.connection.query('SELECT * FROM playlist WHERE ?', {url: playlistUrl}, (err, results, fields) => {
    if (err) {
      callback(err, null)
    } else {
      callback(null, results[0])
    }
  })
}


//takes in playlist ids and returns all movie ids
function fetchPlaylistMovieIds(params, callback) {
  db.connection.query('SELECT movies_movies_id FROM movies_playlists WHERE ?', {playlist_playlist_id: params}, (err, dbMovieIds) => {
    if (err) {
      callback(err, null)
    } else {
      //response is reutrned as an array of "RowDataPacket { movies_movies_id: 342 }""
      let movieIds = [];
      for (let i = 0; i < dbMovieIds.length; i++) {
        movieIds.push(dbMovieIds[i].movies_movies_id);
      }
      callback(null, movieIds);
    }
  })
}


//takes in movie ids and returns the movies
function fetchMovies(params, callback) {
  db.connection.query('SELECT * from movies WHERE movies_id = (?)', [params], (err, results, fields) => {
    if (err) {
      callback(err, null)
    } else {
      callback(null, results);
    }
  })
}


//add an entry to the watched table
function addWatched(params, callback) {
  let insert = {movies_movies_id: params.movieId, users_users_id: params.userId}
  db.connection.query('INSERT INTO watched set ?', insert, (err, response, fields) => {

    if (err) {
      callback(err, null)
    } else {
      callback(null, err)
    }
  })
}

//return all watched movies for a given userid 
function haveWatched(params, callback) {
  db.connection.query('SELECT movies_movies_id FROM watched WHERE ?', params, (err, response, fields) => {
    if (err) {
      callback(err)
    } else {
      let watchedMovieIds = {};
      response.forEach((movieId) => {
        watchedMovieIds[movieId.movies_movies_id] = movieId.movies_movies_id;
      })
      callback(null, watchedMovieIds)
    }
  })
}

function addMessage(params, callback) {
  console.log('what the params look like in the model', params);
  let insert = {movies_movies_id: params.movieId, message: params.movieMessage, users_senderid: params.messageSenderId, users_receiverid: params.messageReceiverId}
  console.log('the insert', insert)
  db.connection.query('INSERT INTO messages set ?', insert, (err, response, fields) => {
    if (err) {
      callback(err)
    } else {
      callback(null, response)
    }
  })
}


exports.fetchPlaylistId = fetchPlaylistId;
exports.fetchMovies = fetchMovies;
exports.fetchPlaylistMovieIds = fetchPlaylistMovieIds;
exports.addWatched = addWatched;
exports.haveWatched = haveWatched;
exports.addMessage = addMessage;