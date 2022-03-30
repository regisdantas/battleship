import "./Battleship.css";

import Header from "./components/views/elements/header";
import NavBar from "./components/views/elements/nav-bar";
import MainMenu from "./components/views/pages/main-menu";
import MatchRoom from "./components/views/pages/match-room";
import GamePlay from "./components/views/pages/game-play";
import GameController from "./components/controllers/game-controller";
import Footer from "./components/views/elements/footer";

const navLinks = [
  { name: "About", link: "#" },
  { name: "Author", link: "#" },
  { name: "Contact", link: "#" },
  { name: "Home", link: "#" },
];

function Battleship() {
  return (
    <div id="page-container">
      <Header title="BATTLESHIP.io" />
      <NavBar navLinks={navLinks} />
      <section id="content-container">
        <GameController />
      </section>
      <Footer />
    </div>
  );
}

export default Battleship;
