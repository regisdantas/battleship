import React from "react";
import Cell from "../../elements/board/cell";
import Board from "../../elements/board";
import "./style.css";

function BoardArrange(props) {
  const { board, ships, onAutoArrange, onReady } = props;
  const [arrangedShips, setArrangedShips] = React.useState(ships);
  React.useEffect(() => {
    setArrangedShips(ships);
  }, [ships]);	
  return (
    <div id="arrange-container">
      <div id="board-session">
        <Board board={board} onCellClick={() => {}} />
      </div>
      <div id="ships-container">
        {ships.map((ship, idx) => {
          console.log(ship);
          if (ship.position.x < 0 || ship.position.y < 0) {
            return (
              <div className="ship-to-arrange" key={idx}>
                {ship.health.map((health, idx) => {
                  return (
                    <Cell
                      key={idx}
                      cell={{ x: 0, y: 0, state: "ship" }}
                      onCellClick={() => {}}
                    ></Cell>
                  );
                })}
              </div>
            );
          }
        })}
        <input type="button" value="Auto Arrange" onClick={onAutoArrange} />
        <input type="button" value="Ready" onClick={() => onReady()} />
      </div>
    </div>
  );
}

export default BoardArrange;
