import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminClients } from './pages/admin/AdminClients'
import { AdminClientEditor } from './pages/admin/AdminClientEditor'
import { ClientPortal } from './pages/client/ClientPortal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientPortal />} />
        <Route path="/admin" element={<AdminClients />} />
        <Route path="/admin/:id" element={<AdminClientEditor />} />
        <Route path="/:slug" element={<ClientPortal />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
