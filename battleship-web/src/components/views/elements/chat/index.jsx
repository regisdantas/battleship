import React from "react";
import "./style.css";

function Chat(props) {
  const { msgHistory, onSendMessage } = props;
  const [newMessage, setNewMessage] = React.useState("");
  const historyArea = React.createRef();

  React.useEffect(() => {
    historyArea.current.scrollTop = historyArea.current.scrollHeight;
  },[msgHistory]);

  const OnTyping = (e) => {
    setNewMessage(e.target.value);
  };

  const OnClear = () => {
    setNewMessage("");
  }

  const OnSend = (e) => {
    onSendMessage(newMessage);
    OnClear();
  }

  const OnKeyDown = (e) => {
    if (e.key === 'Enter') {
      OnSend(e);
    }
  }

  return (
    <div id="chat-container">
      <textarea
        name="msg-history"
        id="msg-history"
        ref={historyArea}
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
        onChange={OnTyping}
        onKeyDown={OnKeyDown}
        value={newMessage}
      ></textarea>
      <button
        onClick={OnSend}
      >
        Send
      </button>
      <button onClick={OnClear}>Clear</button>
    </div>
  );
}

export default Chat;
