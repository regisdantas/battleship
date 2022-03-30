import React from "react";
import Chat from "../../elements/chat";
import "./style.css";

function MatchRoom(props) {
  const { amIAdmin, token, playerNames, chatHistory, onStart, onSendMessage } =
    props;
  return (
    <div id="room-container">
      <div id="status-session">
        <h2>Match Token: {token}</h2>
        <h3>Players:</h3>
        <ul>
          {playerNames.map((player, idx) => (
            <li key={idx}>{player}</li>
          ))}
        </ul>
        {amIAdmin ? <button onClick={onStart}>Start Game</button> : <></>}
      </div>
      <Chat chatHistory={chatHistory} onSendMessage={onSendMessage} />
    </div>
  );
}

export default MatchRoom;
