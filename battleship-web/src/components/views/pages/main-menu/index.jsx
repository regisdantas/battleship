import React from "react";

import "./style.css"

function MainMenu() {
  return (
    <div className="menu-container">
      <h1>Main Menu</h1>
      <button>Single Player</button>
      <button>Create Match</button>
      <button>Join Match</button>
      <button>Find Match</button>
    </div>
  );
}

export default MainMenu;
