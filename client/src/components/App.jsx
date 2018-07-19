import React from "react";
import axios from "axios";
import Login from "./Login.jsx";

import Signup from "./Signup.jsx";
import Profile from "./Profile.jsx";
import Search from "../components/Search.jsx";
import SearchResults from "../components/SearchResults.jsx";
import PlayListViewer from "./PlaylistViewer.jsx";
import Navbar from "./Navbar.jsx";
import SortableComponent from "./Sortable.jsx";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      username: "",
      isLoggedIn: false,
      searchResults: [],
      userInput: "",
      playlist: [],
      user: "placeholder",
      toggleView: true,
      loginHover: false,
      playlistUrlEndpoint: "",
      user: "placeholder",
      toggleView: true
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.updateUserInput = this.updateUserInput.bind(this);
    this.searchOnSubmit = this.searchOnSubmit.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.deleteFromPlaylist = this.deleteFromPlaylist.bind(this);
    this.movePlaylistItemDown = this.movePlaylistItemDown.bind(this);
    this.movePlaylistItemUp = this.movePlaylistItemUp.bind(this);
    this.sendPlaylist = this.sendPlaylist.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  // Login, Logout, Signup Functions

  login(e, username, password) {
    e.preventDefault();
    let body = { username, password };
    axios
      .post("flixmix/login", body)
      .then(response => {
        console.log(response.data[0].users_id);
        this.setState({
          user_id: response.data[0].users_id,
          username: response.data[0].username,
          isLoggedIn: true
        });
      })
      .catch(err => console.log(err));
  }

  logout() {
    this.setState({
      user_id: "",
      isLoggedIn: false
    });
  }

  signup(e, username, password) {
    e.preventDefault();
    let body = { username, password };
    axios
      .post("flixmix/signup", body)
      .then(response => {
        this.setState({
          user_id: response.data[0].user_id,
          username: response.data[0].username,
          isLoggedIn: true
        });
      })
      .then(result => console.log("Console logging signup: ", result))
      .catch(err => console.log(err));
  }

  // Search component helper functions

  updateUserInput(e) {
    this.setState({
      userInput: e.target.value
    });
  }

  searchOnSubmit(e) {
    e.preventDefault();
    let body = { search: this.state.userInput };
    axios.post("flixmix/search", body).then(result => {
      this.setState({
        searchResults: result.data.results
      });
    });
  }

  // Playlist helper functions: add to/delete from playlist, reorder items up/down

  addToPlaylist(e) {
    let newPlaylist = this.state.playlist.slice();
    newPlaylist.push(e);

    this.setState({
      playlist: newPlaylist
    });
  }

  deleteFromPlaylist(index) {
    let playlistCopy = this.state.playlist.slice();
    let newPlaylist = [
      ...playlistCopy.slice(0, index),
      ...playlistCopy.slice(index + 1)
    ];

    this.setState({
      playlist: newPlaylist
    });
  }

  movePlaylistItemUp(array, index) {
    if (index === 0) {
      return array;
    } else {
      let modified = array.slice();
      let temp = modified[index];
      modified[index] = modified[index - 1];
      modified[index - 1] = temp;

      this.setState({
        playlist: modified
      });
    }
  }

  movePlaylistItemDown(array, index) {
    if (index === array.length - 1) {
      return array;
    } else {
      let modified = array.slice();
      let temp = modified[index];
      modified[index] = modified[index + 1];
      modified[index + 1] = temp;

      this.setState({
        playlist: modified
      });
    }
  }

  sendPlaylist() {
    console.log("movies to send", this.state.playlist.map(e => e.original_title));
    axios.post("/flixmix/createPlaylist", {
      movieArr: this.state.playlist,
      user_id: this.state.user_id
    });
  }

  handleHover() {
    this.setState({ loginHover: !this.state.loginHover });
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      playlist: arrayMove(this.state.playlist, oldIndex, newIndex)
    });
  }

  componentDidMount() {
    //change this to will
    if (window.location.href.includes("code")) {
      this.setState({
        toggleView: false,
        playlistUrlEndpoint: window.location.href.slice(-6)
      });
    }
  }

  render() {
    return (
      <div>
        <Navbar handleHover={this.handleHover} />
        <Login
          login={this.login}
          signup={this.signup}
          hover={this.state.loginHover}
        />
        <div className="NavBar" />
        <div className="columns">
          <div className="column is-ancestor is-6">
            <Search
              userInput={this.state.userInput}
              updateUserInput={this.updateUserInput}
              searchOnSubmit={this.searchOnSubmit}
            />
            <div
              style={{
                marginBottom: "10px"
              }}
            />
            <SearchResults
              movies={this.state.searchResults}
              add={this.addToPlaylist}
            />
          </div>
          <div className="column is-ancestor is-6">
            <div className="column is-child is-8">
              <button onClick={this.sendPlaylist} className="button is-warning is-large">
                <span className="icon is large" style={{
                  marginRight: "5px"
                }}>
                  <i className="fa fa-share" />
                </span>
                Create playlist
              </button>
              <div
                style={{
                  marginBottom: "10px"
                }}
              />
              <SortableComponent
                movies={this.state.playlist.map(obj =>
                  String(`${obj.original_title} - (${obj.release_date})`)
                )}
                onSortEnd={this.onSortEnd}
                deletePlaylist={this.deleteFromPlaylist}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// Note for styling: there are <center> tags throughout
// Feel free to remove as you add classNames to components

// Profile component temporarily removed - can add back with <Profile />
