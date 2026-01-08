import { Routes, Route } from 'react-router-dom'
import TestHome from './pages/TestHome'
import ProjectsPage from './pages/public/ProjectsPage'
import ProjectDetailPage from './pages/public/ProjectDetailPage'
import ComponentsDemo from './pages/ComponentsDemo'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { CreateProjectPage } from './pages/creator/CreateProjectPage'
import { EditProjectPage } from './pages/creator/EditProjectPage'
import { MyProjectsPage } from './pages/creator/MyProjectsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Homepage - Galerie de projets publics */}
      <Route path="/" element={<ProjectsPage />} />

      {/* Détail projet */}
      <Route path="/projects/:id" element={<ProjectDetailPage />} />

      {/* Pages de test (dev) */}
      <Route path="/test" element={<TestHome />} />
      <Route path="/components" element={<ComponentsDemo />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Creator - Routes protégées */}
      <Route
        path="/dashboard/projects"
        element={
          <ProtectedRoute>
            <MyProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/create"
        element={
          <ProtectedRoute>
            <CreateProjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id/edit"
        element={
          <ProtectedRoute>
            <EditProjectPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
