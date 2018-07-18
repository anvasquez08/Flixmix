const db = require('../database/db.js');
const Promise = require('bluebird');

const selectPlaylistByUser = userID => {
  return new Promise((resolve, reject) => {
    let qStr = "SELECT playlist_id FROM playlist WHERE users_users_id = ?";
    db.connection.query(qStr, [userID], (err, data) => {
      if (err) reject(err);
      else {
        let playlists = data.map(id => Object.values(id)[0]);
        resolve(playlists); // arr of playlists ids
      }
    });
  });
};

const getPlaylistMovies = playlists => {
  let qStr =
    "SELECT movies_movies_id FROM movies_playlists WHERE playlist_playlist_id = ?";
  let promises = [];
  playlists.forEach(playlist => {
    promises.push(
      new Promise((resolve, reject) => {
        db.connection.query(qStr, [playlist], (err, data) => {
          if (err) reject(err);
          else {
            console.log("playlist movie objects", data);
            let moviesIDarr = data.map(id => Object.values(id)[0]);
            resolve(moviesIDarr); // arr of movie ids
          }
        });
      })
    );
  });
  return Promise.all(promises); //returns nestedMovieArr
};

const getMoviesData = nestedMovieArr => {
  let qStr = "SELECT * FROM movies WHERE movies_id = ?";
  let promises = [];
  nestedMovieArr.forEach(movieArr => {
    movieArr.forEach(movie => {
      promises.push(
        new Promise((resolve, reject) => {
          db.connection.query(qStr, [movie], (err, data) => {
            if (err) reject(err);
            else {
              resolve(JSON.parse(JSON.stringify(data))); // arr of movie ids
            }
          });
        })
      );
    });
  });
  return Promise.all(promises); //returns nestedMovieArr
};

const getAllMoviePlaylist = () => {
  let qStr = "SELECT * from movies_playlists"
  return new Promise((resolve, reject) => {
    db.connection.query(qStr, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })  
  })
}

const getMovieDataForExplorePage = (arrayOfMovieObjects) => {
  let promisesArr = [];
  arrayOfMovieObjects.forEach((movie) => {
    let movieID = movie.movies_movies_id;
    promisesArr.push(new Promise((resolve, reject) => {
      let qStr = "SELECT * FROM movies WHERE movies_id = ?"
      db.connection.query(qStr, movieID, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })     
    }))
  })
  return Promise.all(promisesArr)
}


exports.selectPlaylistByUser = selectPlaylistByUser
exports.getPlaylistMovies = getPlaylistMovies;
exports.getMoviesData = getMoviesData
exports.getAllMoviePlaylist = getAllMoviePlaylist
exports.getMovieDataForExplorePage = getMovieDataForExplorePage



