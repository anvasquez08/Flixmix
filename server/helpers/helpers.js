module.exports = {
  mapPlaylistIDtoMovieID: (playlistID, movieIDArrayOfObjects) => {
    console.log('these are the objects', movieIDArrayOfObjects)
    return movieIDArrayOfObjects.map((object) => {
      return [object.movies_id, playlistID]
    })
  }
}