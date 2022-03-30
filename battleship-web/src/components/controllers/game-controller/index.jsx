import React from "react";
import io from "socket.io-client";
import Pages from "../../views";
import { useTransition, animated } from "react-spring";

import "./style.css";

function GameController() {
  let socket = React.useRef();
  const [gameState, setGameState] = React.useState("connecting");
  const [matchState, setMatchState] = React.useState({
    token: "",
    amIAdmin: false,
    amIReady: false,
    isMyTurn: false,
    myShips: [],
    myBoard: [],
    enemyBoard: [],
    playerNames: [],
    chatHistory: [],
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

    socket.current.on("match-state", (data) => {
      setMatchState((lastMatchState) => ({
        ...data,
        isMyTurn: lastMatchState.isMyTurn,
      }));
      setTimeout(() => OnTurnTransitionTimeOut(data.isMyTurn), 1000);
    });
  }, []);

  const OnTurnTransitionTimeOut = (isMyTurn) => {
    setMatchState((lastMatchState) => ({
      ...lastMatchState,
      isMyTurn: isMyTurn,
    }));
    console.log("Setting player turn to: ", isMyTurn);
  };

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
    connecting: <h3>Connecting to server...</h3>,
    "player-join": <Pages.PlayerJoin OnPlayerJoin={OnPlayerJoin} />,
    "main-menu": <Pages.MainMenu OnMenuSelect={OnMenuSelect} />,
    "match-room": (
      <Pages.MatchRoom
        amIAdmin={matchState.amIAdmin}
        token={matchState.token}
        playerNames={matchState.playerNames}
        chatHistory={matchState.chatHistory}
        onStart={OnStart}
        onSendMessage={OnSendMessage}
      />
    ),
    "board-arrange": (
      <Pages.BoardArrange
        board={matchState.myBoard}
        myShips={matchState.myShips}
        onAutoArrange={OnAutoArrange}
        onReady={OnReady}
      />
    ),
    "game-play": (
      <Pages.GamePlay
        board={matchState.isMyTurn ? matchState.enemyBoard : matchState.myBoard}
        chatHistory={matchState.chatHistory}
        turnMsg={
          matchState.isMyTurn ? "Sua vez de jogar" : "Vez do oponente jogar"
        }
        onCellClick={OnCellClick}
        onSendMessage={OnSendMessage}
      />
    ),
  };

  return pagesByState[gameState] ? (
    pagesByState[gameState]
  ) : (
    <h3>Failed to connect to server!</h3>
  );
}

export default GameController;
