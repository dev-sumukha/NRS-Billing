import React,{useState} from 'react'
import axios from 'axios'
import UserContext from "./UserContext"

function UserContextProvider({children}) {
    const[token,setToken] = useState(localStorage.getItem('token'))
    const[user,setUser] = useState({})

    let isLoggedIn = !!token

    function storeTokenInLS(serverToken) {
        
        setToken(serverToken)
        return localStorage.setItem("token",serverToken)
    }

    function LogoutUser() {
        setUser("")
        setToken("")
        return localStorage.removeItem("token")
    }
    return (
        <>
            <UserContext.Provider value={{token,storeTokenInLS,isLoggedIn,LogoutUser}}>
                {children}
            </UserContext.Provider>
        </>
    )
}

export default UserContextProvider