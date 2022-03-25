import React from "react";
import "./style.css";
function Cell(props) {
  const { cell, onCellClick } = props;
  return <div className={cell.state} onClick={() => onCellClick(cell)} />;
}

export default Cell;
