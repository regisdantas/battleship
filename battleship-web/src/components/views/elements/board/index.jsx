import React from "react";
import Cell from "./cell";
import "./style.css";
function Board(props) {
  const { board, onCellClick } = props;
  return (
    <div id="board-container">
      {board.map((row, rowIndex) => (
        <div className="row" key={row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={rowIndex + "" + colIndex}
              onCellClick={onCellClick}
              cell={cell}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
