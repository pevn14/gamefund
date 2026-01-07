import { Routes, Route } from 'react-router-dom'
import TestHome from './pages/TestHome'
import ProjectsPage from './pages/public/ProjectsPage'
import ProjectDetailPage from './pages/public/ProjectDetailPage'
import ComponentsDemo from './pages/ComponentsDemo'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      {/* Homepage - Galerie de projets */}
      <Route path="/" element={<ProjectsPage />} />

      {/* Détail projet */}
      <Route path="/projects/:id" element={<ProjectDetailPage />} />

      {/* Pages de test (dev) */}
      <Route path="/test" element={<TestHome />} />
      <Route path="/components" element={<ComponentsDemo />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
