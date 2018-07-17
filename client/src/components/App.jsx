import React from 'react';
import axios from 'axios';

import Login from './Login.jsx';
import Profile from './Profile.jsx';

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      user_id: ''
    }
    this.loginUser = this.loginUser.bind(this);
  }

  loginUser(e, username, password) {
    e.preventDefault()
    let body = {username,  password}
    axios.post('mixflix/login', body)
    .then(response => { this.setState({user_id: response.data[0].users_id})})
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div>MixFlasdasdix
      <Login loginUser={this.loginUser}/>
      <Profile />
      </div>
      )
  }
}


export default App;