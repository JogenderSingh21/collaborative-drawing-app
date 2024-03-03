import './App.css'
import {Container} from './components/container/Container'
import { Dashboard } from './pages/Dashboard'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import {BrowserRouter, Route, Routes} from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/whiteboard/:RoomID" element={<Container />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
