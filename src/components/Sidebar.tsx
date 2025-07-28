import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Building2,
  Users,
  UserCheck,
  CreditCard,
  BarChart3,
  Building,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Tenants', href: '/tenants', icon: Users },
  { name: 'Landlords', href: '/landlords', icon: Building },
  { name: 'Agents', href: '/agents', icon: UserCheck },
  { name: 'Rent Payments', href: '/rent-payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 px-6 pb-4 shadow-2xl">
        <div className="flex h-16 shrink-0 items-center">
          <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-white">
            Double A<span className="text-primary-200">MS</span>
          </span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm'
                            : 'text-primary-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                        }`
                      }
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar