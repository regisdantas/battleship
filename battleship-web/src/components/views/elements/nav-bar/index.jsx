import React from "react";
import "./style.css"

function NavBar(props) {
  const { navLinks } = props;
  return (
    <nav id="nav-bar">
      <div id="nav-bar-container">
        <ul>
          {navLinks.map((link, index) => (
            <li key={index}>
              <a href={link.link}>{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
