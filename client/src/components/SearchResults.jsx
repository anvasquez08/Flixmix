import React from "react";

let genCard = ({ poster_path, release_date, title, overview }) => {
  return (
    <div className="message card is-link weird">
      <div className="media-content ">
        <div className="message-header">
            {title}
        </div>
      </div>
      <div className="columns">
      <div className="card-image column is-2">
        <p className=" image">
          <img
            className="cardimg"
            src={"https://image.tmdb.org/t/p/w500" + poster_path}
          />
        </p>
      </div>
        <div className="message-body column is-8">
          <p style={{}}>
            <small>{overview.slice(0, 280)}</small>
          </p>
        </div>
        </div>
      <div
        className="media-right"
        style={{
          visibility: "hidden"
        }}
      >
      </div>
    </div>
  );
};

let SearchResults = props => {
  return (
    <div>
      <ul>
        {props.movies.map(movie => {
          return (
            <li
              style={{
                marginBottom: "10px"
              }}
              onClick={() => {
                props.add(movie);
              }}
            >
              {genCard(movie)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;
