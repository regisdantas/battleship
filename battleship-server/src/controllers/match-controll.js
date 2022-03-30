import * as boardCtrl from "./board-controll.js";

export const PlayerJoinMatch = (player, match, amIAdmin) => {
  console.log(`Player: ${player.name} joined match token: ${match.token}`);
  match.players.push(player);
  player.match = match;
  player.matchState.amIAdmin = amIAdmin;
  match.MatchStateUpdate();
};

export const PlayerLeaveMatch = (player) => {};

export const PlayerAutoArrange = (player) => {
  player.matchState.myBoard = boardCtrl.CreateBoard("hidden");
  player.matchState.myShips.map((ship) => {
    boardCtrl.ArrangeShip(ship, player.matchState.myBoard);
  });
  player.UpdateMatchState(player.match);
};

export const ShootCell = (player, cell) => {
  console.log(player, cell);
  if (player.matchState.isMyTurn !== true) return false;
  let hit = false;
  const enemyPlayer = player.match.GetOtherPlayer(player);
  if (
    boardCtrl.PointIsValid(cell.x, cell.y) &&
    boardCtrl.PointIsHidden(player.matchState.enemyBoard, cell.x, cell.y)
  ) {
    if (
      boardCtrl.PointIsShipNotDestroyed(
        enemyPlayer.matchState.myBoard,
        cell.x,
        cell.y
      ) === true
    ) {
      const shipData = boardCtrl.GetShip(
        enemyPlayer.matchState.myShips,
        cell.x,
        cell.y
      );
      shipData.ship.health[shipData.healthIxdex] = 0;
      boardCtrl.UpdateBoardShips(
        enemyPlayer.matchState.myBoard,
        enemyPlayer.matchState.myShips,
        "ship"
      );
      boardCtrl.UpdateBoardShips(
        player.matchState.enemyBoard,
        enemyPlayer.matchState.myShips,
        "hidden"
      );
      hit = true;
    } else {
      enemyPlayer.matchState.myBoard[cell.y][cell.x].state = "water";
      player.matchState.enemyBoard[cell.y][cell.x].state = "water";
    }
  }
  if (!hit) player.match.SetTurn();
  player.match.MatchStateUpdate();
  return hit;
};
