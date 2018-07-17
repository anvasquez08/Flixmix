import React from 'react';

let Search = (props) => {
  return (
  <div>
    <input onChange={props.updateUserInput}></input>
    <button onClick={props.searchOnSubmit}>Search</button>
  </div>
  )
}


export default Search;