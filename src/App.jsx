import { Routes, Route } from 'react-router-dom'
import TestHome from './pages/TestHome'
import ComponentsDemo from './pages/ComponentsDemo'
import SupabaseTest from './pages/SupabaseTest'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TestHome />} />
      <Route path="/components" element={<ComponentsDemo />} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
    </Routes>
  )
}

export default App
