import React from 'react';
import axios from 'axios';

class Explore extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      moviePlaylists: []
    }
  }

  componentDidMount() {
    axios.get('flixmix/explore')
    .then(res => this.setState({moviePlaylists: res.data}))
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <h2>Explore Playlists</h2>

        {
          this.state.moviePlaylists.map((movieTuple, i) => {
              return (
                <div key={movieTuple[0]}>
                    <div>PLAYLIST {movieTuple[0]}</div>
                    {
                      movieTuple[1].map((movieObject, i) => {
                        return (
                        <div key={movieObject.movies_id}>
                            <div>Title: {movieObject.original_title}</div>
                            <div>Popularity: {movieObject.popularity}</div>
                            <div>Release Date: {movieObject.release_date}</div>
                            <img src={'https://image.tmdb.org/t/p/w500'+ movieObject.poster_path}></img>
                        </div>
                        )
                      })
                    }
                </div>
                )
            })
        }

      </div>
      )
  }
}

export default Explore;