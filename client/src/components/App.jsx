import React from 'react';
import Search from '../components/Search.jsx'
import SearchResults from '../components/SearchResults.jsx'
import Playlist from './Playlist.jsx';
import axios from 'axios';


class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
      userInput: '',
      playlist: [],
      user: 'placeholder'
    }
    this.updateUserInput = this.updateUserInput.bind(this);
    this.searchOnSubmit = this.searchOnSubmit.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
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

      <Search userInput={this.state.userInput} updateUserInput={this.updateUserInput} searchOnSubmit={this.searchOnSubmit}/>
      <SearchResults movies={this.state.searchResults} addToPlaylist={this.addToPlaylist}/>
      <Playlist movies={this.state.playlist}/>



      </div>
      )
  }
}


export default App;