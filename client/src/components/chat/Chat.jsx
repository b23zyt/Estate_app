import { useContext, useState, useEffect, useRef} from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import {format} from "timeago.js"; //used to calculagte how much time before sending the text
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({chats}) {
  //console.log(chats);
  const [chat, setChat] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const {socket} = useContext(SocketContext);

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat]);
  

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if(!res.data.seenBy.includes(currentUser.id)){
        decrease();
      }
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
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    }catch(err) {
      console.log(err);
    }
  }

  //send the data click the button means send the message: hi from client to the server (same from send data from server to client)
  // const testSocket = () => {
  //   socket.emit("test", "hi from client");
  // }

  //CREATE A useEffect TO LISTEN TO THE EVENT getMessage
  
  useEffect(() => {

    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      }catch(err) {
        console.log(err);
      }
    }

    if(chat && socket){
      socket.on("getMessage", (data) => {
        if(chat.id === data.chatId){
          setChat(prev => ({...prev, message: [...prev.message, data]}));
          read();
        }
      });
    }
  }, [socket, chat]);

  return (
    <div className="chat">
      {/* <button onClick={testSocket}>Test</button>  for test purposes*/} 
      <div className="messages">
        <h1>Messages</h1>
        {
          chats?.map(c => (
            <div className="message" 
              key={c.id} 
              style={{backgroundColor: c.seenBy.includes(currentUser.id) || c?.id === c.id ? "white" : "#fecd514e",}}
              onClick={() => handleOpenChat(c.id, c.receiver)}>
              <img
                src={c.receiver.avatar || "/noavatar.jpg"}
                alt=""
              />
              <span>{c.receiver.username}</span>
              <p>{c.lastMessage}</p>
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
              <span>{format(message.createdAt)}</span>
            </div>
          ))}
          <div ref={messageEndRef}>
          </div>
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
