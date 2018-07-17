const db = require('../database/db.js');

module.exports = {
  fetchUsersMoviesList: (req, res) => {
    db.handleDisconnect();
    let {userID} = req.params;
    console.log('this is the userID', userID)
    // 1) select playlist for user
    let querySelectPlaylistPerUser = 'SELECT playlist_id FROM playlist WHERE users_users_id = ?';
    db.connection.query(querySelectPlaylistPerUser, userID, (err, data) => {
      if (err) {res.status(404).end()} 
        else {
        let playlistIds = data.map((obj) => obj.playlist_id)
        console.log('playlist ID',  playlistIds)
    // 2) select moviesID per playlist 
        let querySelectMovieIDsPerPlaylist = 'SELECT * FROM movies_playlists WHERE playlist_playlist_id = ?'
        db.connection.query(querySelectMovieIDsPerPlaylist, playlistIds, (err, data) => {
          if (err) {res.status(404).end()}    
            else {
              console.log('movieIDs', data)
              res.send(data)            
           }
        })
      }
    })
  }
}

// users: userid 
// playlist: playlist_id & users_users_id
//`movies_playlists: `movies_movies_id & playlist_playlist_id