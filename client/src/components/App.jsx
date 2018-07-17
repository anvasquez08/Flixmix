import React from 'react';
import Search from '../components/Search.jsx'
import SearchResults from '../components/SearchResults.jsx'
import Playlist from './Playlist.jsx';
import axios from 'axios';

import Login from './Login.jsx';
import Profile from './Profile.jsx';

class App extends React.Component{
  constructor(props) {
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
  }

  loginUser(e, username, password) {
    e.preventDefault()
    let body = {username,  password}
    axios.post('mixflix/login', body)
    .then(response => { this.setState({user_id: response.data[0].users_id})})
    .catch(err => console.log(err))
  }

  updateUserInput(e) {
    this.setState({
      userInput: e.target.value
    });
  }

  searchOnSubmit() {
    axios.post('/search', {
      search: this.state.userInput
    })
    .then((result) => {
      this.setState({
        searchResults: result.data.results
      })
    })
  }

  addToPlaylist(e) {
    let newPlaylist = this.state.playlist.slice();
    newPlaylist.push(e);

    this.setState({
      playlist: newPlaylist
    })
  }
  

  render() {
    return (
      <div>
      <div>FLIXMIX</div>
      <Login loginUser={this.loginUser}/>
      <Profile />
      <Search userInput={this.state.userInput} updateUserInput={this.updateUserInput} searchOnSubmit={this.searchOnSubmit}/>
      <SearchResults movies={this.state.searchResults} addToPlaylist={this.addToPlaylist}/>
      <Playlist movies={this.state.playlist}/>
      </div>
      )
  }
}


export default App;