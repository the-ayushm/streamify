import React from 'react'
import Signup from './pages/signup/signup'
import Signin from './pages/signin/signin'
import Dashboard from './pages/dashboard/Dashboard'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
function App() {
  const {user} = useAuth();
  return (<>
    <Routes>
      <Route path="/" element={user ? <Dashboard/> : <Navigate to='/signin' /> } />
      <Route path="/signup" element={user ? <Navigate to='/' /> :  <Signup />} />
      <Route path="/signin" element={user ? <Navigate to='/' /> :  <Signin />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  </>
  )
}

export default App