import React from 'react';


class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInput: ''
    }
  }

  render() {
    return (
    <div>
      <input onChange={this.props.updateUserInput}></input>
      <button onClick={this.props.searchOnSubmit}>Search</button>
    </div>
    )
  }
}

export default Search;