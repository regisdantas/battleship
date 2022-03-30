import Player from "./player.js";

// Models
import Match from "./match.js";

// Controllers
import * as MatchCtrl from "../controllers/match-controll.js";

// Views
import GameState from "../controllers/game-states.js";

class GameServer {
  constructor(socket) {
    console.log("Creating Game Server");
    this.players = [];
    this.pendingMatches = [];
    this.runningMatches = [];
    this.socket = socket;

    this.states = [
      {
        trigger: "player-join",
        state: new GameState("main-menu", [
          { key: "single-player" },
          { key: "multi-player" },
          { key: "create-match", callback: this.OnCreateMatch.bind(this) },
          { key: "join-match", callback: this.OnJoinMatch.bind(this) },
        ]),
      },
      {
        trigger: ["create-match", "join-match"],
        state: new GameState("match-room", [
          { key: "start-game", callback: this.OnStartGame.bind(this) },
          { key: "chat-message", callback: this.OnChatMessage.bind(this) },
          { key: "leave-match" },
        ]),
      },
      {
        trigger: "start-game",
        state: new GameState("board-arrange", [
          { key: "player-ready", callback: this.OnPlayerReady.bind(this) },
          { key: "auto-arrange", callback: this.OnAutoArrange.bind(this) },
          { key: "leave-match" },
        ]),
      },
      {
        trigger: "player-ready",
        state: new GameState("game-play", [
          { key: "shoot-cell", callback: this.OnShootCell.bind(this) },
          { key: "chat-message", callback: this.OnChatMessage.bind(this) },
          { key: "leave-match" },
        ]),
      },
    ];

    socket.on("connection", this.OnClientConnected.bind(this));
    socket.on("disconnection", this.OnClientDisconnected.bind(this));
  }

  GetNextState = (trigger) => {
    for (let i = 0; i < this.states.length; i++) {
      if (Array.isArray(this.states[i].trigger) === true) {
        if (this.states[i].trigger.includes(trigger) === true) {
          return this.states[i].state;
        }
      } else if (this.states[i].trigger === trigger) {
        return this.states[i].state;
      }
    }
    return null;
  };

  OnClientConnected = (client) => {
    console.log("Client Connected.");
    client.on("player-join", (data) => this.OnPlayerJoin(client, data));
    client.emit("game-state", "player-join");
  };

  OnClientDisconnected = (client) => {
    console.log("Client Disconnected.");
  };

  OnPlayerJoin = (client, data) => {
    try {
      let thisPlayer = this.players.filter((player) => {
        return player.name === data.name;
      });
      if (Array.isArray(thisPlayer) && thisPlayer.length !== 0) {
        client.emit("error-message", {
          message: "Name is already being used.",
        });
      } else {
        console.log(`Player ${data.name} joined`);
        let newPlayer = new Player(data.name, client);
        this.players.push(newPlayer);
        newPlayer.BindAction("disconnect", () => this.OnPlayerLeave(newPlayer));
        this.states[0].state.OnEnter(newPlayer);
      }
    } catch (e) {
      console.error(e);
    }
  };

  OnPlayerLeave = (player) => {
    this.players = this.players.filter((inList) => inList !== player);
  };

  OnCreateMatch = (trigger, player, data) => {
    try {
      console.log(
        `[${trigger}] Player: ${player.name} is going to Create Match.`
      );
      let newMatch = new Match();
      MatchCtrl.PlayerJoinMatch(player, newMatch, true);
      this.pendingMatches.push(newMatch);
      return this.GetNextState(trigger);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  OnJoinMatch = (trigger, player, data) => {
    try {
      console.log(
        `[${trigger}] Player: ${player.name} is going to Join Match: ${data.token}`
      );
      let foundMatch = this.pendingMatches.filter((match) => {
        return match.token === data.token;
      });
      if (
        foundMatch != undefined &&
        Array.isArray(foundMatch) &&
        foundMatch.length > 0
      ) {
        MatchCtrl.PlayerJoinMatch(player, foundMatch[0], false);
        return this.GetNextState(trigger);
      } else {
        player.client.emit("error-message", { message: "Match not found." });
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  OnChatMessage = (trigger, player, data) => {
    player.match.NewChatMessage(player, data);
    return null;
  };

  OnStartGame = (trigger, player, data) => {
    try {
      if (player.match.StartMatch() === true) {
        console.log(`Player: ${player.name} is going to Arrange Board`);
        this.pendingMatches = this.pendingMatches.filter((match) => {
          return match !== player.match;
        });
        this.runningMatches.push(player.match);
        const gamePlay = this.GetNextState(trigger);
        player.match.players.map((allPlayer) => {
          gamePlay.OnEnter(allPlayer);
        });
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  OnPlayerReady = (trigger, player, data) => {
    try {
      console.log(`Player: ${player.name} is Ready.`);
      if (player.match.PlayerReady(player) === true) {
        const gamePlay = this.GetNextState(trigger);
        player.match.players.map((allPlayer) => {
          gamePlay.OnEnter(allPlayer);
        });
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  OnAutoArrange = (trigger, player, data) => {
    try {
      console.log(`Player: ${player.name} is Auto Arranging.`);
      MatchCtrl.PlayerAutoArrange(player);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  OnShootCell = (trigger, player, data) => {
    try {
      console.log(
        `Player: ${player.name} is shooting at ${data.cell.toString()}`
      );
      MatchCtrl.ShootCell(player, data.cell);
    } catch (e) {
      console.error(e);
    }
    return null;
  };
}

export default (socket) => {
  return new GameServer(socket);
};
