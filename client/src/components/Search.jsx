import React from "react";

let Search = props => {
  return (
    <div>
      <input
        className="input is-primary h"
        placeholder="&#xf002;"
        style={{
          fontFamily: "Arial, FontAwesome"
        }}
        onChange={props.updateUserInput}
      />
      <button onClick={props.searchOnSubmit}>Search</button>
    </div>
  );
};

export default Search;
