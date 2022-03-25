import React from "react";
import "./style.css";

function Chat(props) {
  const { msgHistory, onSendMessage } = props;
  const [newMessage, setNewMessage] = React.useState("");

  const onTyping = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div id="chat-container">
      <textarea
        name="msg-history"
        id="msg-history"
        cols="30"
        rows="10"
        readOnly={true}
        value={msgHistory
          .map((entry) => `${entry.player}: ${entry.text}`)
          .join("\n")}
      ></textarea>
      <textarea
        name="type-msg"
        id="type-msg"
        cols="30"
        rows="10"
        onChange={onTyping}
      ></textarea>
      <button
        onClick={(e) => {
          onSendMessage(newMessage);
          e.target.value = "";
        }}
      >
        Send
      </button>
      <button>Clear</button>
    </div>
  );
}

export default Chat;
