import React from "react";
import io from "socket.io-client";
import Pages from "../../views";

function GameController() {
  let socket = React.useRef();
  const [gameState, setGameState] = React.useState({
    state: "connecting",
    turn: false,
    isAdmin: false,
    myBoard: [],
    enemyBoard: [],
    match: {
      token: "",
      players: [],
      chat: [],
    },
    ships: [],
  });

  React.useEffect(() => {
    console.log("Reconnecting to socket: ", process.env.REACT_APP_SERVER_URL);
    socket.current = io(process.env.REACT_APP_SERVER_URL);
    socket.current.on("connection", () => {
      console.log("connected to server");
    });

    socket.current.on("game-state", (data) => {
      setGameState(data);
    });
  }, []);

  const OnPlayerJoin = (name) => {
    socket.current.emit("player-join", { name: name });
  };

  const OnMenuSelect = (mode) => {
    if (mode === "join-match") {
      const token = prompt("Enter match token");
      socket.current.emit(mode, { token: token });
    } else socket.current.emit(mode);
  };

  const OnStart = () => {
    socket.current.emit("start-game");
  };

  const OnSendMessage = (msg) => {
    socket.current.emit("chat-message", { text: msg });
  };

  const OnAutoArrange = () => {
    socket.current.emit("auto-arrange");
  };

  const OnReady = (ships) => {
    socket.current.emit("player-ready", { ships: ships });
  };

  const OnCellClick = (cell) => {
    socket.current.emit("shoot-cell", { cell: cell });
  };

  const pagesByState = {
    "connecting": <h3>Connecting to server...</h3>,
    "player-join": <Pages.PlayerJoin OnPlayerJoin={OnPlayerJoin} />,
    "main-menu": <Pages.MainMenu OnMenuSelect={OnMenuSelect} />,
    "match-room": (
      <Pages.MatchRoom
        isAdmin={gameState.isAdmin}
        token={gameState.match.token}
        players={gameState.match.players}
        msgHistory={gameState.match.chat}
        onStart={OnStart}
        onSendMessage={OnSendMessage}
      />
    ),
    "board-arrange": (
      <Pages.BoardArrange
        board={gameState.myBoard}
        ships={gameState.ships}
        onAutoArrange={OnAutoArrange}
        onReady={OnReady}
      />
    ),
    "game-play": (
      <Pages.GamePlay
        board={gameState.turn ? gameState.enemyBoard : gameState.myBoard}
        msgHistory={gameState.match.chat}
        turnMsg={gameState.turn ? "Sua vez de jogar" : "Vez do oponente jogar"}
        onCellClick={OnCellClick}
        onSendMessage={OnSendMessage}
      />
    ),
  };

  return pagesByState[gameState.state] ? (
    pagesByState[gameState.state]
  ) : (
    <h3>Failed to connect to server!</h3>
  );
}

export default GameController;
