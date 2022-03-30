import * as boardControll from "../controllers/board-controll.js";

export default class Match {
  constructor() {
    this.token = this.NewToken();
    this.chatHistory = [];
    this.players = [];
    this.turn = 0;
    console.log(`New match created -  Token: ${this.token}`);
  }

  MatchStateUpdate() {
    this.players.map((player) => {
      player.UpdateMatchState(this);
    });
  }

  NewToken() {
    return Math.random().toString(36).substr(2);
  }

  NewChatMessage(player, message) {
    this.chatHistory.push({ player: player.name, text: message.text });
    console.log(`Player: ${player.name} said: ${message.text}`);
    this.MatchStateUpdate();
  }

  GetOtherPlayer(player) {
    return this.players[0] === player ? this.players[1] : this.players[0];
  }

  SetTurn() {
    this.turn = (this.turn + 1) % this.players.length;
    const turnPlayer = this.players[this.turn];
    turnPlayer.matchState.turn = true;
    const otherPlayer = this.GetOtherPlayer(turnPlayer);
    otherPlayer.matchState.turn = false;
  }

  StartMatch() {
    if (this.players.length === 2) {
      this.players.map((player) => {
        player.matchState.enemyBoard = boardControll.CreateBoard("hidden");
        player.matchState.myBoard = boardControll.CreateBoard("hidden");
        player.matchState.myShips = boardControll.CreateShips();
        player.matchState.amIReady = false;
      });
      this.MatchStateUpdate();
      return true;
    }
    return false;
  }

  PlayerReady(player) {
    let allReady = true;
    player.matchState.amIReady = true;
    if (boardControll.ShipsAreValid(player.matchState.ships) === true) {
      this.players.map((player) => {
        console.log(player.name, "ready", player.matchState.amIReady);
        if (player.matchState.amIReady === false) {
          allReady = false;
        }
      });
    }
    this.MatchStateUpdate();
    return allReady;
  }

  StartGamePlayer() {
    this.SetTurn();
    this.players.map((player) => {
      player.gameState.enemyBoard = this.CreateEmptyBoard("hidden");
    });
  }
}
