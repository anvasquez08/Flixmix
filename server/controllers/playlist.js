const db = require('../database/db.js');
const playlistModel = require('../models/playlist.js');

db.handleDisconnect()

module.exports = {
  fetchUsersMoviesList: (req, res) => {
    let {userID} = req.params;
    playlistModel.selectPlaylistByUser(userID)
      .then((playlists) => playlistModel.getPlaylistMovies(playlists))
      .then((nestedMovieArr) => playlistModel.getMoviesData(nestedMovieArr))
      .then((movieList) => res.send(movieList))
      .catch(err => res.send(err))
      .catch(err => res.send(err))
      .catch(err => res.send(err))
  }
}


