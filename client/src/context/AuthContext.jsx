import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const updateUser = (data) => {
        setCurrentUser(data);
    };

    useEffect (() => {localStorage.setItem("user", JSON.stringify(currentUser));}, [currentUser]);

    return <AuthContext.Provider value={{currentUser, setCurrentUser, updateUser}}>{children}</AuthContext.Provider>
};
