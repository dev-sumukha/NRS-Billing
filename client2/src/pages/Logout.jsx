import React, { useContext, useEffect } from 'react'
import userContext from '../store/UserContext'
import { Navigate } from 'react-router-dom'

function Logout() {
  const { LogoutUser } = useContext(userContext)
  
  useEffect(()=>{
    LogoutUser()
  },[])
  
  return (
    <Navigate to="/"/>
  )
}

export default Logout