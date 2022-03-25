const Player = require("./player.js");
const Match = require("./match.js");

module.exports = class Player {
  constructor(name, client) {
    this.name = name;
    this.client = client;
    this.gameState = {
      state: "main-menu",
      ready: false,
      myBoard: [],
      enemyBoard: [],
      match: {
        token: "",
        players: [],
        chat: [],
      },
    };
  }

  JoinMatch(match) {
    this.match = match;
    this.gameState.match = match.state;
  }
};
