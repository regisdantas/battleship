import React from "react";
import "./style.css";

function Header(props) {
  const { title } = props;
  return (
    <header id="main-header">
      <div id="header-container">
        <h1>{title}</h1>
      </div>
    </header>
  );
}

export default Header;
