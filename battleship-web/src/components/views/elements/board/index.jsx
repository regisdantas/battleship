import React from "react";
import Cell from "./cell";
import "./style.css";
function Board(props) {
  const { board, onCellClick } = props;
  return (
    <div id="board-container">
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}_${colIndex}`}
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
