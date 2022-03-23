import "./Battleship.css";

import Header from "./components/views/header";
import NavBar from "./components/views/nav-bar";
import MainMenu from "./components/views/pages/main-menu";
import Footer from "./components/views/footer";
const navLinks = [
  {name: "About", link: "#"},
  {name: "Author", link: "#"},
  {name: "Contact", link: "#"},
  {name: "Home", link: "#"}
]

function Battleship() {
  return (
    <div className="page-container">
      <Header title="BATTLESHIP.io"/>
      <NavBar navLinks={navLinks}/>
      <section id="main">
        <MainMenu/> 
      </section>
      <Footer/>
    </div>
  );
}

export default Battleship;
