import React from 'react'
import userContext from './store/UserContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) { 
    const { isLoggedIn } = useContext(userContext)

    return (
        <>
            {isLoggedIn ? children: <Navigate to="/" />}
        </>
  )
}

export default ProtectedRoute