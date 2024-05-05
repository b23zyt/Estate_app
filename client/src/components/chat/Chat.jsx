import { useContext, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import {format} from "timeago.js"; //used to calculagte how much time before sending the text

function Chat({chats}) {
  console.log(chats);
  const [chat, setChat] = useState(null);
  const {currentUser} = useContext(AuthContext);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      setChat({...res.data, receiver})
    }catch(err){
      console.log(err)
    }
  }

  const handleSubmit = async evt => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const text = formData.get("text");
    if (!text) {
      return;
    }

    try {
      const res = await apiRequest.post("/messages/" + chat.id, {text});
      setChat(prev => ({...prev, message: [...prev.message, res.data]})); //save the message inside chat.message
      evt.target.reset(); //reset input (don't want to see the message in the text bar)
    }catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {
          chats?.map(chat => (
            <div className="message" 
              key={chat.id} 
              style={{backgroundColor: chat.seenBy.includes(currentUser.id) ? "white" : "#fecd514e",}}
              onClick={() => handleOpenChat(chat.id, chat.receiver)}>
              <img
                src={chat.receiver.avatar || "/noavatar.jpg"}
                alt=""
              />
              <span>{chat.receiver.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          ))
        }
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar ? chat.receiver.avatar : "/noavatar.jpg"}
                alt=""
              />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={()=>setChat(null)}>X</span>
          </div>
          <div className="center">
          {chat.message.map(message => (
            <div 
              className="chatMessage"
              style={{ //used to change position of the text
                alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                textAlign: message.userId === currentUser.id ? "right" : "left",
              }}
              key={message.id}
            >
              <p>{message.text}</p>
              <span>{format(message.createAt)}</span>
            </div>

          ))}
          </div>
          <form className="bottom" onSubmit={handleSubmit}>
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
