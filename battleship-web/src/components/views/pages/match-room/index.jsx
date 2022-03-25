import React from "react";
import Chat from "../../elements/chat";
import "./style.css";

function MatchRoom(props) {
  const { token, players, msgHistory, onStart, onSendMessage } = props;
  return (
    <div id="room-container">
      <div id="status-session">
        <h2>Match Token: {token}</h2>
        <h3>Players:</h3>
        <ul>
          {players.map(player => <li>{player}</li>)}
        </ul>
        <button onClick={onStart}>Start Game</button>
      </div>
      <Chat msgHistory={msgHistory} onSendMessage={onSendMessage}/>
    </div>
  );
}

export default MatchRoom;
