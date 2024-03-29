import React from "react";
import "./style.css";
import Board from "../../elements/board";
import Chat from "../../elements/chat";

function GamePlay(props) {
  const { board, chatHistory, turnMsg, onCellClick, onSendMessage } = props;

  return (
    <div id="game-container">
      <div id="board-session">
        <Board board={board} onCellClick={onCellClick} />
        <h3>{turnMsg}</h3>
      </div>
      <Chat chatHistory={chatHistory} onSendMessage={onSendMessage} />
    </div>
  );
}

export default GamePlay;
