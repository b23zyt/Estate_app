import {Server, Socket} from "socket.io";

//emit means send messages, on means listen
const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
    //IF USERID IS ALREADY INSIDE THE ARRAY
    const userExits = onlineUser.find(user => user.userId === userId);

    if(!userExits){
        onlineUser.push({userId, socketId});
    }
}

//find user and remove it
const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

//return the user we are looking for
const getUser = (userId) => {
    return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //console.log(socket.id);

    // socket.on("test", (data)=> {
    //     console.log(data);
    // })

    //get the userId from the client and save it to onlineUser
    socket.on("newUser", (userId)=> {
        addUser(userId, socket.id);
        console.log(onlineUser); //get two users here, userId and socketId
    });

    socket.on("sendMessage", ({receiverId, data}) => {
        console.log(receiverId); //get the userid
        console.log(data); //get Message
        //SEND THE DATA TO OTHER USER
        const receiver = getUser(receiverId);
        io.to(receiver.socketId).emit("getMessage", data);
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
    });
});


io.listen("4000");