import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
  darkMode?: boolean
}

export function Layout({ children, darkMode = true }: LayoutProps) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`border-b ${darkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">C</div>
              CONSULTORIA IA
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
