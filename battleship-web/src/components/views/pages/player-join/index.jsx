import React from "react";
import "./style.css";
function PlayerJoin(props) {
  const { OnPlayerJoin } = props;
  const [name, setName] = React.useState("");
  const OnNameChange = (e) => {
    setName(e.target.value);
  };
  return (
    <div id="join-container">
      <h3>Player name:</h3>
      <input
        id="nickname"
        type="text"
        placeholder="Enter a nickname"
        onChange={OnNameChange}
      />
      <button
        id="join-button"
        onClick={(e) => {
          OnPlayerJoin(name);
        }}
      >
        Join Game
      </button>
    </div>
  );
}

export default PlayerJoin;
