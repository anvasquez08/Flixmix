const model = require('../models/playlistView')
const axios = require('axios');

module.exports = {
  getPlaylistFromUrl: (req, res) => {
    console.log('the request query', req)
    let playlistUrl = req.query.url;
    let userId = req.query.userId;
    //step one get the movies the user has watched already in prep of displaying dynamic playlist
    //including watched data
    model.haveWatched(userId, (err, movieIds) => {
      if (err) {
        console.error('there was an error fetching the watched movies for this user', err)
      } else {
        console.log('movieIds returned from watched call', movieIds);
        let watchedMovies = movieIds;
        //step one - fetch the playlist ids for the given url
        model.fetchPlaylistId(playlistUrl, (err, playlistId) => {
          if (err) {
            console.error('there was an error getting the playlist id from the db', err)
          } else {
            console.log('what the playlist id db call looks like', playlistId);
            //step two - fetch the movie ids for the given playlist id
            model.fetchPlaylistMovieIds(playlistId , (err, movieIds) => {
              if (err) {
                console.error('there was an get the movies for the given playlist id', err);
              }
              console.log('what the movie ids response from the db looks like in the server', movieIds)
              //step three - fetch the movies for the given movie ids
              let finalPlaylist = {
                title: null,
                user: null,
                movies: []
              }
              //logic to stop the function from sending a response untill all the data has been scrubbed
              movieIds.forEach((movieId, i, collection) => {
                console.log('the movie id were attempting to fetch the data for in the server', movieId)
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
        console.log('success posting to the watched table', success);
        res.send();
      }
    })
  },
  searchYoutube: (req, res) => {
    console.log('req params before we send to youtube', req)
    let params = {
      q: req.query.currentVideo,
      maxResults: 1,
      part: 'snippet',
      type: ''
    }
    axios.get('https://www.googleapis.com/youtube/v3/search', {params: params}, (err, response) => {
      if (err) {
        console.error('there was a problem getting the search results from youtube', err)
      } else {
        console.log('response body from youtube', res.body)
        let parsedBody = JSON.parse(res.body);
        let videoId = parsedBody.items.id.videoId
        res.send(videoId);
      }
    })
  }
}