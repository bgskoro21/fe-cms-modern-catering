import React, { useReducer } from "react";
import UserContext from "./UserContext";
import { UserReducer, initialState } from "./UserReducer";

const UserProvider = ({ children }) => {
  const [userState, dispatchUser] = useReducer(UserReducer, initialState);
  return <UserContext.Provider value={{ userState, dispatchUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
