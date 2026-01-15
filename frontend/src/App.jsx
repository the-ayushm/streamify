import React from 'react'
import Signup from './pages/signup/signup'
import Signin from './pages/signin/signin'
import {Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (<>
  <Routes>
    <Route path="/signup" element={<Signup/>} />
    <Route path="/signin" element={<Signin/>} />
    <Route path="*" element={<Navigate to="/signin" />} />
  </Routes>
  </>
  )
}

export default App