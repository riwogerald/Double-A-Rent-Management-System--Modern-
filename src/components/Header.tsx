import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User } from 'lucide-react'

const Header: React.FC = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-2">
            <User className="h-5 w-5 text-secondary-500" />
            <span className="text-sm font-medium text-secondary-700">
              {user?.email}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-x-2 rounded-md bg-secondary-100 px-3 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-200 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header