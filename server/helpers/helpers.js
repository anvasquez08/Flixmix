module.exports = {
 mapPlaylistIDtoMovieID: (playlistID, movieIDArrayOfArrayOfObjects) => {
    return movieIDArrayOfArrayOfObjects.map((array) => {
      return [array[0].movies_id,  playlistID]
    })
  }
  
}
