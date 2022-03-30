import Match from "./match.js";

const playerConstants = {
  initialMatchState: {
    token: "",
    amIAdmin: false,
    amIReady: false,
    isMyTurn: false,
    myShips: [],
    myBoard: [],
    enemyBoard: [],
    playerNames: [],
    chatHistory: [],
  },
};

export default class Player {
  constructor(name, client) {
    this.name = name;
    this.client = client;
    this.SetGameState("player-join");
    this.matchState = playerConstants.initialMatchState;
  }

  UpdateMatchState(match) {
    this.matchState = {
      ...this.matchState,
      token: match.token,
      isMyTurn: match.players[match.turn].name === this.name,
      playerNames: match.players.map((player) => player.name),
      chatHistory: match.chatHistory,
    };
    this.client.emit("match-state", this.matchState);
  }

  SetGameState(gameState, stateAction) {
    if (this.stateAction !== undefined) {
      this.stateAction.OnExit(this);
    }
    this.stateAction = stateAction;
    this.gameState = gameState;
    this.client.emit("game-state", this.gameState);
  }

  BindAction(keyword, callback) {
    console.log(`Binding ${keyword} to ${this.name}`);
    this.client.on(keyword, (data) => callback(this, data));
  }

  RemoveAction(keyword) {
    this.client.removeAllListeners(keyword);
  }
}
