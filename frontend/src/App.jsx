import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ForgotPassword from './pages/ForgotPassword'



function App() {
  return (
    <>
    <GoogleOAuthProvider clientId="391195891094-gda44kflv0i1rlvh3doc9579ui100p19.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster position="top-center" />

        <Routes path='/*'>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/*' element={<Home/>}/>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path='/forgotpassword' element={<ForgotPassword />}/>
        </Routes>

      </BrowserRouter>
    </GoogleOAuthProvider>
    </>
  )
}

export default App
