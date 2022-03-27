import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import {setUserInfo} from '../redux/auth-redux'

const AuthProvider =({ children })=> {
    let [user, setUser] = React.useState(null);
    const dispatch = useDispatch()
  
    let signin = async (newUser, callback) => {
      const resp = await dispatch(setUserInfo(newUser))
        setUser(resp);
        callback();
      
    };
  
    let signout = (callback) => {
      return setUser(null,() => {
        callback();
      });
    };
  
    let value = { user, signin, signout };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }