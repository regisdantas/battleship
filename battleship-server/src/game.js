// const helper = require('./helper.js');
const Player = require("./player.js");
const Match = require("./match.js");

class Game {
  constructor(socket) {
    console.log("Creating Game");
    this.players = [];
    this.pendingMatches = [];
    this.runningMatches = [];
    this.socket = socket;

    socket.on("connection", this.OnClientConnected.bind(this));
    socket.on("disconnection", this.OnClientDisconnected.bind(this));
  }

  OnUpdatePlayer(player) {
    console.log("Updating Player: " + player.name);
    player.client.emit("game-state", player.gameState);
  }

  OnClientConnected = (client) => {
    console.log("Client Connected.");
    client.on("player-join", (data) => this.OnPlayerJoin(client, data));
    client.emit("game-state", {
      state: "player-join",
      match: {
        token: "",
        players: [],
        chat: [],
      },
    });
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
        this.PlayerMenuSetup(newPlayer);
        this.players.push(newPlayer);
        client.emit("game-state", newPlayer.gameState);
        client.on("disconnect", () => this.OnPlayerLeave(newPlayer));
      }
    } catch (e) {
      console.error(e);
    }
  };

  OnPlayerLeave = (player) => {
    this.players = this.players.filter((inList) => inList !== player);
  };

  PlayerMenuSetup = (player) => {
    player.client.on("single-player", (data) =>
      this.OnSinglePlayer(player, data)
    );
    player.client.on("find-match", (data) => this.OnFindMatch(player, data));
    player.client.on("create-match", (data) =>
      this.OnCreateMatch(player, data)
    );
    player.client.on("join-match", (data) => this.OnJoinMatch(player, data));
  };

  PlayerMenuDetach = (player) => {
    player.client.removeAllListeners("single-player");
    player.client.removeAllListeners("find-match");
    player.client.removeAllListeners("create-match");
    player.client.removeAllListeners("join-match");
  };

  OnSinglePlayer = (player, data) => {
    try {
      console.log(`Player: ${player.name} is going Single Player`);
      this.PlayerMenuDetach(player);
      this.OnUpdatePlayer(player);
    } catch (e) {
      console.error(e);
    }
  };

  OnFindMatch = (player, data) => {
    try {
      console.log(`Player: ${player.name} is going to Find Match`);
      this.PlayerMenuDetach(player);
      this.OnUpdatePlayer(player);
    } catch (e) {
      console.error(e);
    }
  };

  PlayerMatchSetup = (player) => {
    player.client.on("start-game", (data) => this.OnBoardArrange(player, data));
  };

  PlayerMatchDetach = (player) => {
    player.client.removeAllListeners("start-game");
  };

  OnCreateMatch = (player, data) => {
    try {
      console.log(`Player: ${player.name} is going to Create Match`);
      this.PlayerMenuDetach(player);
      let newMatch = new Match(this.OnUpdatePlayer);
      this.SetMatchRoom(player, newMatch);
      this.pendingMatches.push(newMatch);
      this.PlayerMatchSetup(player);
    } catch (e) {
      console.error(e);
    }
  };

  OnJoinMatch = (player, data) => {
    try {
      console.log(
        `Player: ${player.name} is going to Join Match: ${data.token}`
      );
      let foundMatch = this.pendingMatches.filter((match) => {
        return match.state.token === data.token;
      });
      if (
        foundMatch != undefined &&
        Array.isArray(foundMatch) &&
        foundMatch.length > 0
      ) {
        this.PlayerMenuDetach(player);
        player.JoinMatch(foundMatch[0]);
        this.SetMatchRoom(player, foundMatch[0]);
        this.OnUpdatePlayer(player);
      } else {
        player.client.emit("error-message", { message: "Match not found." });
      }
    } catch (e) {
      console.error(e);
    }
  };

  SetMatchRoom = (player, match) => {
    match.PlayerJoin(player);
    player.gameState.state = "match-room";
    player.client.on("chat-message", (message) =>
      player.match.NewChatMessage(player, message)
    );
    this.OnUpdatePlayer(player);
  };

  BoardArrangeSetup = (player) => {
    player.client.on("auto-arrange", (data) => this.OnAutoArrange(player, data));
    player.client.on("player-ready", (data) => this.OnPlayerReady(player, data));
  };

  BoardArrangeDetach = (player) => {
    player.client.removeAllListeners("auto-arrange");
    player.client.removeAllListeners("player-ready");
  };

  OnBoardArrange = (player, data) => {
    try {
      console.log(`Player: ${player.name} is going to Start Game`);
      if (player.match.BoardArrange(this.BoardArrangeSetup) === true) {
        this.PlayerMatchDetach(player);
        this.pendingMatches = this.pendingMatches.filter((match) => {
          return match !== player.match;
        });
        this.runningMatches.push(player.match);
        this.OnUpdatePlayer(player);
      }
    } catch (e) {
      console.error(e);
    }
  }

  OnAutoArrange = (player, data) => {
    try {
      console.log(`Player: ${player.name} is going to Auto Arrange`);
      player.match.AutoArrange(player);
      this.OnUpdatePlayer(player);
    } catch (e) {
      console.error(e);
    }
  }

  OnPlayerReady = (player, data) => {
    try {
      console.log(`Player: ${player.name} is going to Ready`);
      this.BoardArrangeDetach(player);
      if (player.match.PlayerReady(player, this.GamePlaySetup) === true) {
        
      }
    } catch (e) {
      console.error(e);
    }
  }

  GamePlaySetup = (player) => {
    player.gameState.state = "game-play";
    player.client.on("shoot-cell", (data) => this.OnShootCell(player, data));
    this.OnUpdatePlayer(player);
  };

  GamePlayDetach = (player) => {
    player.client.removeAllListeners("shoot-cell");
  };

  OnShootCell = (player, data) => {
    try {
      console.log(`Player: ${player.name} is shooting at ${data}`);
      player.match.ShootCell(player, data.cell);
      this.OnUpdatePlayer(player);
    } catch (e) {
      console.error(e);
    }
  };

}

module.exports = (socket) => {
  return new Game(socket);
};
