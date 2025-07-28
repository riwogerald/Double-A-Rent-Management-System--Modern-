import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Building2, User, Eye, EyeOff, Info } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const demoAccounts = [
    { email: 'admin@property.com', password: 'Admin123!', role: 'Administrator' },
    { email: 'manager@property.com', password: 'Manager123!', role: 'Manager' },
    { email: 'agent1@property.com', password: 'Agent123!', role: 'Agent' },
    { email: 'test@example.com', password: 'Test123!', role: 'User' }
  ]
  
  const useDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  const { user, signIn, signUp } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-300 bg-opacity-20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-secondary-400 bg-opacity-15 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-primary-400 bg-opacity-10 rounded-full blur-lg animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 rounded-3xl shadow-lg">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
                  {isSignUp ? 'Create Account' : 'Welcome Back!'}
                </h2>
                <p className="mt-2 text-sm text-secondary-600">
                  {isSignUp ? 'Join Double A Property Management System' : 'Sign in to your account'}
                </p>
              </div>

              {/* Form */}
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className="w-full pl-4 pr-12 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-error-50 p-4 border border-error-200">
                    <div className="text-sm text-error-700">{error}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    isSignUp ? '✨ Create Account' : '🚀 Sign In'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Demo Accounts */}
        <div className="hidden lg:flex flex-1 items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Demo Header */}
              <div className="text-center mb-8">
                <div className="bg-white/20 p-3 rounded-2xl inline-block mb-4">
                  <Info className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Try Demo Accounts</h3>
                <p className="text-primary-100 text-sm">
                  Click any account below to auto-fill the login form
                </p>
              </div>

              {/* Demo Accounts List */}
              <div className="space-y-3">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => useDemoAccount(account.email, account.password)}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">{account.role}</div>
                        <div className="text-primary-100 text-xs font-mono">{account.email}</div>
                      </div>
                      <div className="text-primary-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Features List */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h4 className="text-white font-semibold mb-4 text-sm">✨ System Features</h4>
                <div className="space-y-2 text-xs text-primary-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-300 rounded-full mr-2"></div>
                    Property Management
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-300 rounded-full mr-2"></div>
                    Tenant & Landlord Management
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-300 rounded-full mr-2"></div>
                    Rent Payment Tracking
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-300 rounded-full mr-2"></div>
                    Financial Reports
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-300 rounded-full mr-2"></div>
                    Agent Commission Management
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login