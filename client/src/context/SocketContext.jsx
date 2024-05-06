import React, { createContext, useContext, useEffect, useState } from "react";
import {io} from "socket.io-client";
import {AuthContext} from "./AuthContext"

export const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
    const {currentUser} = useContext(AuthContext);
    const [socket, setSocket] = useState(null);

    //connect to socket when visit the website
    useEffect (() => {
        setSocket(io("http://localhost:4000"))
    }, []);

    useEffect(()=> {
        currentUser && socket?.emit("newUser", currentUser.id);
    }, [currentUser, socket]);

    return (
        <SocketContext.Provider value={{socket}}>
        {children}
        </SocketContext.Provider>
    );
};
