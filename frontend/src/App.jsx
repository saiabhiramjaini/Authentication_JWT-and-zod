import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Signup from "./components/Signup"
import Signin from "./components/Signin"
import Home from "./components/Home"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from './components/ResetPassword'
import DashBoard from './components/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
        <Route path='/dashboard' element={<DashBoard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
