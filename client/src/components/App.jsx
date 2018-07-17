import React from 'react';
import axios from 'axios';

import Login from './Login.jsx';
import Profile from './Profile.jsx';
import Search from '../components/Search.jsx'
import SearchResults from '../components/SearchResults.jsx'
import Playlist from './Playlist.jsx';


class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      searchResults: [],
      userInput: '',
      playlist: [],
      user: 'placeholder'
    }
    this.loginUser = this.loginUser.bind(this);
    this.updateUserInput = this.updateUserInput.bind(this);
    this.searchOnSubmit = this.searchOnSubmit.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.deleteFromPlaylist = this.deleteFromPlaylist.bind(this);
    this.movePlaylistItemUp = this.movePlaylistItemUp.bind(this);
    this.movePlaylistItemDown = this.movePlaylistItemDown.bind(this);
  }

  loginUser(e, username, password) {
    e.preventDefault()
    let body = {username,  password}
    axios.post('flixmix/login', body)
    .then(response => { this.setState({user_id: response.data[0].users_id})})
    .catch(err => console.log(err))
  }

  // Search component helper functions:
  //        Update user input
  //        Send user input to TMDb API on submit

  updateUserInput(e) {
    this.setState({
      userInput: e.target.value
    });
  }

  searchOnSubmit() {
    let body = {search: this.state.userInput}
    axios.post('flixmix/search', body)
    .then((result) => {
      this.setState({
        searchResults: result.data.results
      })
    })
  }


  // Playlist helper functions: add and delete to playlist
  //                            reorder playlist items (up/down)

  addToPlaylist(e) {
    let newPlaylist = this.state.playlist.slice();
    newPlaylist.push(e);

    this.setState({
      playlist: newPlaylist
    })
  }

  deleteFromPlaylist(index) {
    let playlistCopy = this.state.playlist.slice();
    let newPlaylist = [...playlistCopy.slice(0, index), ...playlistCopy.slice(index+1)]

    this.setState({
      playlist: newPlaylist
    })

  }

  movePlaylistItemUp(array, index) {
    if (index === 0) {
      return array
    } else {
      let modified = array.slice();
      let temp = modified[index];
      modified[index] = modified[index-1];
      modified[index-1] = temp;

      this.setState({
        playlist: modified
      })

    }
  }

  movePlaylistItemDown(array, index) {
    if (index === array.length-1) {
      return array
    } else {
      let modified = array.slice();
      let temp = modified[index];
      modified[index] = modified[index+1];
      modified[index+1] = temp;

      this.setState({
        playlist: modified
      })

    }
  }
  
  render() {
    return (
      <div>
      <div>FLIXMIX</div>
      <Login loginUser={this.loginUser}/>
      <Profile />
      <Search userInput={this.state.userInput} updateUserInput={this.updateUserInput} searchOnSubmit={this.searchOnSubmit}/>
      <SearchResults movies={this.state.searchResults} add={this.addToPlaylist}/>
      <Playlist movies={this.state.playlist} delete={this.deleteFromPlaylist} moveUp={this.movePlaylistItemUp} moveDown={this.movePlaylistItemDown}/>
      </div>
      )
  }
}


export default App;