import React from "react";
import Board from "../../elements/board";
import "./style.css";

function BoardArrange(props) {
  const { board, ships, onAutoArrange, onReady } = props;
  const [arrangedShips, setArrangedShips] = React.useState(ships);
  return (
    <div id="arrange-container">
      <div id="board-session">
        <Board board={board} onCellClick={() => {}} />
      </div>
      <div id="ships-container">
        <div id="ships-list">
          <ul>
            {arrangedShips.map((ship, idx) => {
              return (
                <li key={idx}>
                  <span>{ship.type}</span>
                  <span>{ship.health}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <input type="button" value="Auto Arrange" onClick={onAutoArrange} />
        <input type="button" value="Ready" onClick={() => onReady()} />
      </div>
    </div>
  );
}

export default BoardArrange;
