import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Tenants from './pages/Tenants'
import Landlords from './pages/Landlords'
import Agents from './pages/Agents'
import RentPayments from './pages/RentPayments'
import Reports from './pages/Reports'
import Login from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="properties" element={<Properties />} />
                <Route path="tenants" element={<Tenants />} />
                <Route path="landlords" element={<Landlords />} />
                <Route path="agents" element={<Agents />} />
                <Route path="rent-payments" element={<RentPayments />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App