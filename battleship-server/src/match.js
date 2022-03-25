const boardSize = 15;

module.exports = class Match {
  constructor(UpdatePlayer) {
    this.state = {
      token: this.NewToken(),
      chat: [],
      players: [],
      turn: 0,
    };
    this.UpdatePlayer = UpdatePlayer;
    this.players = [];
    console.log(`New match created -  Token: ${this.state.token}`);
  }

  PlayerJoin(player) {
    if (player != undefined) {
      this.state.players.push(player.name);
      this.players.push(player);
      player.JoinMatch(this);
      console.log(
        `Player: ${player.name} joined match token: ${this.state.token}`
      );
      this.players.map((player) => this.UpdatePlayer(player));
    }
  }

  CreateEmptyBoard(state) {
    let board = [];
    for (let i = 0; i < boardSize; i++) {
      board.push([]);
      for (let j = 0; j < boardSize; j++) {
        board[i].push({ x: j, y: i, state: state });
      }
    }
    return board;
  }

  CreateShips() {
    let ships = [];
    for (let i = 0; i < 4; i++) {
      ships.push({
        id: i,
        type: "submarine",
        position: {
          x: -1,
          y: -1,
        },
        orientation: "horizontal",
        health: [1],
      });
      if (i < 3) {
        ships.push({
          id: i,
          type: "destroyer",
          position: {
            x: -1,
            y: -1,
          },
          orientation: "horizontal",
          health: [1, 1],
        });
      }
      if (i < 2) {
        id: i,
          ships.push({
            type: "cruiser",
            position: {
              x: -1,
              y: -1,
            },
            orientation: "horizontal",
            health: [1, 1, 1, 1],
          });
      }
      if (i < 1) {
        id: i,
          ships.push({
            type: "battleship",
            position: {
              x: -1,
              y: -1,
            },
            orientation: "horizontal",
            health: [1, 1, 1, 1, 1],
          });
      }
    }
    return ships;
  }

  BoardArrange(Attach) {
    if (this.players.length === 2) {
      this.players.map((player) => {
        Attach(player);
        player.gameState.state = "board-arrange";
        player.gameState.myBoard = this.CreateEmptyBoard("water");
        player.gameState.ships = this.CreateShips();
        this.UpdatePlayer(player);
      });
      return true;
    }
    return false;
  }

  PointIsValid(x, y) {
    if (
      x >= 0 &&
      x < boardSize &&
      y >= 0 &&
      y < boardSize
    ) {
      return true;
    }
    return false;
  }

  PointIsEmpty(board, x, y) {
    if (!this.PointIsValid(x, y)) {
      return false;
    }
    if (
      board[y][x].state !== "ship" &&
      board[y][x].state !== "destroyed"
    ) {
      return true;
    }
    return false;
  }

  PointIsShip(board, x, y) {
    if (!this.PointIsValid(x, y)) {
      return false;
    }
    if (
      board[y][x].state === "ship" ||
      board[y][x].state === "destroyed"
    ) {
      return true;
    }
    return false;
  }

  PointIsHidden(board, x, y) {
    if (!this.PointIsValid(x, y)) {
      return false;
    }
    if (board[y][x].state === "hidden") {
      return true;
    }
    return false;
  }

  PointIsEmptyValid(board, x, y) {
    if (
      this.PointIsValid(x, y) &&
      this.PointIsEmpty(board, x, y)
    ) {
      return true;
    }
    return false;
  }

  NeighborIsShip(board, x, y) {
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
  }

  ArrangeShip(ship, board) {
    let startY = Math.floor(Math.random() * (boardSize - 1));
    let startX = Math.floor(Math.random() * (boardSize - 1));
    let orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
    if (
      !this.PointIsEmptyValid(board, startX, startY) ||
      this.NeighborIsShip(board, startX, startY)
    ) {
      this.ArrangeShip(ship, board);
      return;
    }
    for (let i = 1; i <= ship.health.length; i++) {
      let nextX = startX + (orientation === "horizontal" ? i : 0);
      let nextY = startY + (orientation === "vertical" ? i : 0);
      if (
        !this.PointIsEmptyValid(board, nextX, nextY) ||
        this.NeighborIsShip(board, nextX, nextY)
      ) {
        this.ArrangeShip(ship, board);
        return;
      }
    }
    ship.position.x = startX;
    ship.position.y = startY;
    ship.orientation = orientation;
    for (let i = 0; i < ship.health.length; i++) {
      let nextX = startX + (orientation === "horizontal" ? i : 0);
      let nextY = startY + (orientation === "vertical" ? i : 0);
      board[nextY][nextX].state = "ship";
    }
  }

  AutoArrange(player) {
    player.gameState.myBoard = this.CreateEmptyBoard("water");
    player.gameState.ships.map((ship) => {
      this.ArrangeShip(ship, player.gameState.myBoard);
    });
  }

  ShipsAreValid(ships) {
    return true;
  }

  GetOtherPlayer(player) {
    return this.players[0] === player ? this.players[1] : this.players[0];
  }

  SetTurn() {
    this.state.turn = (this.state.turn + 1) % this.players.length;
    const turnPlayer = this.players[this.state.turn];
    turnPlayer.gameState.turn = true;
    const otherPlayer = this.GetOtherPlayer(turnPlayer);
    otherPlayer.gameState.turn = false;
  }

  PlayerReady(player, Attach) {
    let allReady = true;
    if (this.ShipsAreValid(player.gameState.ships) === true) {
      player.gameState.ready = true;
      this.players.map((player) => {
        console.log(player.name, "ready", player.gameState.ready);
        if (player.gameState.ready === false) {
          allReady = false;
        }
      });
      if (allReady === true) {
        console.log("All players are ready");
        this.StartGamePlayer(Attach);
      }
      this.UpdatePlayer(player);
    }
    return allReady;
  }

  StartGamePlayer(Attach) {
    this.SetTurn();
    this.players.map((player) => {
      player.gameState.enemyBoard = this.CreateEmptyBoard("hidden");
      Attach(player);
    });
  }

  ShootCell(player, cell) {
    const enemyPlayer = this.GetOtherPlayer(player);
    console.log(cell.toString(), enemyPlayer);
    if (
      this.PointIsValid(cell.x, cell.y) &&
      this.PointIsHidden(player.gameState.enemyBoard, cell.x, cell.y)
    ) {
      if (this.PointIsShip(enemyPlayer.gameState.myBoard, cell.x, cell.y) === true) {
        player.gameState.enemyBoard[cell.y][cell.x].state = "destroyed";
        enemyPlayer.gameState.myBoard[cell.y][cell.x].state = "destroyed";
        this.players.map((player) => this.UpdatePlayer(player));
        return true;
      } else {
        player.gameState.enemyBoard[cell.y][cell.x].state = "water";
      }
    }
    this.SetTurn();
    this.players.map((player) => this.UpdatePlayer(player));
    return false;
  }

  GamePlayStart() {
    this.players.map((player) => this.UpdatePlayer(player));
  }

  NewToken() {
    return Math.random().toString(36).substr(2);
  }

  NewChatMessage(player, message) {
    this.state.chat.push({ player: player.name, text: message.text });
    console.log(`Player: ${player.name} said: ${message.text}`);
    this.players.map((player) => this.UpdatePlayer(player));
  }
};
