const model = require('../models/playlistView')
const axios = require('axios');
const youtubeKey = require('../../config/mitch_youtube_api_key').YOUTUBE_KEY;

module.exports = {
  getPlaylistFromUrl: (req, res) => {
    let playlistUrl = req.query.url;
    let userId = req.query.userId;
    //step one get the movies the user has watched already in prep of displaying dynamic playlist
    //including watched data
    model.haveWatched(userId, (err, movieIds) => {
      if (err) {
        console.error('there was an error fetching the watched movies for this user', err)
      } else {
        let watchedMovies = movieIds;
        //step one - fetch the playlist ids for the given url
        model.fetchPlaylistId(playlistUrl, (err, playlistId) => {
          if (err) {
            console.error('there was an error getting the playlist id from the db', err)
          } else {
            //step two - fetch the movie ids for the given playlist id
            model.fetchPlaylistMovieIds(playlistId , (err, movieIds) => {
              if (err) {
                console.error('there was an get the movies for the given playlist id', err);
              }
              //step three - fetch the movies for the given movie ids
              let finalPlaylist = {
                title: null,
                user: null,
                movies: []
              }
              //logic to stop the function from sending a response untill all the data has been scrubbed
              movieIds.forEach((movieId, i, collection) => {
                model.fetchMovies(movieId, (err, movieResults) => {
                  if (err) {
                    console.log('there was an error getting the movies for the given movie id', err)
                  } else {
                    let movieToAdd = {
                      watched: false,
                      movieInfo: {
                        movieId: movieResults[0].movies_id,
                        title: movieResults[0].original_title,
                        posterPath: movieResults[0].poster_path,
                        releaseDate: movieResults[0].release_date,
                        popularity: movieResults[0].popularity
                      }
                    }
                    //if this has already been watched, flip the watched flag
                    if (watchedMovies[movieToAdd.movieInfo.movieId]) {
                      movieToAdd.watched = true;
                    }
                    finalPlaylist.movies.push(movieToAdd);
                    if (i === collection.length-1) {
                      res.send(finalPlaylist)
                    }
                  }
                })
              })
            })
          }
        })
      }
    })
  },
  addWatchedMovie: (req, res) => {
    model.addWatched(req.body, (err, success) => {
      if (err) {
        console.error('in the server: there was an error mosting this to the watched table', err)
      } else {
        res.send();
      }
    })
  },
  searchYoutube: (req, res) => {
    console.log('req params before we send to youtube', req.query)
    //building the youtube query to build proper format
    qParam = req.query.searchTerm.split(' ').join('+');
    axios.get(`https://www.googleapis.com/youtube/v3/search?q=${qParam}&maxResults=1&part=snippet&type=&key=${youtubeKey}`) 
     .then(response => {
        let videoId = response.data.items[0].id.videoId
        console.log('the video id before we send it', videoId)
        res.send(videoId);
      })
    .catch((error) => {
      console.log('there was an error hitting the youtube api from the server', error)
    })
  }
}

// params: params,
// headers: {
//   authorization: youtubeKey
// }
// }