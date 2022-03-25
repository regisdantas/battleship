import React from "react";

import "./style.css"

function MainMenu(props) {
  const {OnMenuSelect} = props;
  return (
    <div id="menu-container">
      <h1>Main Menu</h1>
      <button onClick= {() => OnMenuSelect("single-player")}>Single Player</button>
      <button onClick= {() => OnMenuSelect("create-match")}>Create Match</button>
      <button onClick= {() => OnMenuSelect("join-match")}>Join Match</button>
      <button onClick= {() => OnMenuSelect("find-match")}>Find Match</button>
    </div>
  );
}

export default MainMenu;
