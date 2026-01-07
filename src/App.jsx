import { Routes, Route } from 'react-router-dom'
import TestHome from './pages/TestHome'
import ComponentsDemo from './pages/ComponentsDemo'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TestHome />} />
      <Route path="/components" element={<ComponentsDemo />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
