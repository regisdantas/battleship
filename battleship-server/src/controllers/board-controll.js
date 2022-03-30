const boardSize = 15;

export const CreateBoard = (state) => {
  let board = [];
  for (let i = 0; i < boardSize; i++) {
    board.push([]);
    for (let j = 0; j < boardSize; j++) {
      board[i].push({ x: j, y: i, state: state });
    }
  }
  return board;
};

export const CreateShips = () => {
  let ships = [];
  for (let i = 0; i < 4; i++) {
    ships.push({
      x: -1,
      y: -1,
      orientation: "horizontal",
      health: [1],
    });
    if (i < 3) {
      ships.push({
        x: -1,
        y: -1,
        orientation: "horizontal",
        health: [1, 1],
      });
    }
    if (i < 2) {
      ships.push({
        x: -1,
        y: -1,
        orientation: "horizontal",
        health: [1, 1, 1, 1],
      });
    }
    if (i < 1) {
      ships.push({
        x: -1,
        y: -1,
        orientation: "horizontal",
        health: [1, 1, 1, 1, 1],
      });
    }
  }
  return ships;
};

export const PointIsValid = (x, y) => {
  if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
    return true;
  }
  return false;
};

export const PointIsEmpty = (board, x, y) => {
  if (!PointIsValid(x, y)) {
    return false;
  }
  if (board[y][x].state !== "ship" && board[y][x].state !== "destroyed") {
    return true;
  }
  return false;
};

export const PointIsShip = (board, x, y) => {
  if (!PointIsValid(x, y)) {
    return false;
  }
  if (
    board[y][x].state === "ship" ||
    board[y][x].state === "destroyed" ||
    board[y][x].state === "ship-destroyed"
  ) {
    return true;
  }
  return false;
};

export const PointIsShipNotDestroyed = (board, x, y) => {
  if (!PointIsValid(x, y)) {
    return false;
  }
  if (board[y][x].state === "ship") {
    return true;
  }
  return false;
};

export const PointIsHidden = (board, x, y) => {
  if (!PointIsValid(x, y)) {
    return false;
  }
  if (board[y][x].state === "hidden") {
    return true;
  }
  return false;
};

export const PointIsEmptyValid = (board, x, y) => {
  if (PointIsValid(x, y) && PointIsEmpty(board, x, y)) {
    return true;
  }
  return false;
};

export const NeighborIsShip = (board, x, y) => {
  if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
    if (x - 1 >= 0 && board[y][x - 1].state === "ship") {
      return true;
    }
    if (x + 1 < boardSize && board[y][x + 1].state === "ship") {
      return true;
    }
    if (y - 1 >= 0 && board[y - 1][x].state === "ship") {
      return true;
    }
    if (y + 1 < boardSize && board[y + 1][x].state === "ship") {
      return true;
    }
  }
  return false;
};

export const ArrangeShip = (ship, board) => {
  let startY = Math.floor(Math.random() * (boardSize - 1));
  let startX = Math.floor(Math.random() * (boardSize - 1));
  let orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
  if (
    !PointIsEmptyValid(board, startX, startY) ||
    NeighborIsShip(board, startX, startY)
  ) {
    ArrangeShip(ship, board);
    return;
  }
  for (let i = 1; i <= ship.health.length; i++) {
    let nextX = startX + (orientation === "horizontal" ? i : 0);
    let nextY = startY + (orientation === "vertical" ? i : 0);
    if (
      !PointIsEmptyValid(board, nextX, nextY) ||
      NeighborIsShip(board, nextX, nextY)
    ) {
      ArrangeShip(ship, board);
      return;
    }
  }
  ship.x = startX;
  ship.y = startY;
  ship.orientation = orientation;
  for (let i = 0; i < ship.health.length; i++) {
    let nextX = startX + (orientation === "horizontal" ? i : 0);
    let nextY = startY + (orientation === "vertical" ? i : 0);
    board[nextY][nextX].state = "ship";
  }
};

export const ShipsAreValid = (ships) => {
  return true;
};

export const GetShip = (ships, x, y) => {
  for (let j = 0; j < ships.length; j++) {
    let testShip = ships[j];
    let shipX = testShip.x;
    let shipY = testShip.y;
    for (let i = 0; i < testShip.health.length; i++) {
      if (
        x === shipX + (testShip.orientation === "horizontal" ? i : 0) &&
        y === shipY + (testShip.orientation === "vertical" ? i : 0)
      ) {
        return { ship: testShip, healthIxdex: i };
      }
    }
  }
  return { ship: null, healthIxdex: -1 };
};

export const GetShipHealth = (ship) => {
  let health = 0;
  ship.health.forEach((healthPoint) => {
    health += healthPoint;
  });
  return health;
};

export const UpdateBoardShips = (board, ships, hiddenState) => {
  ships.forEach((ship) => {
    const shipDestroyedState =
      GetShipHealth(ship) > 0 ? "destroyed" : "ship-destroyed";
    let shipX = ship.x;
    let shipY = ship.y;
    for (let i = 0; i < ship.health.length; i++) {
      board[shipY][shipX].state =
        ship.health[i] > 0 ? hiddenState : shipDestroyedState;
      shipX += ship.orientation === "horizontal" ? 1 : 0;
      shipY += ship.orientation === "vertical" ? 1 : 0;
    }
  });
};
