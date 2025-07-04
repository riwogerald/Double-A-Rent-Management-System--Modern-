import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Building2,
  Users,
  UserCheck,
  CreditCard,
  BarChart3,
  Settings,
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
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-sm border-r border-secondary-200">
        <div className="flex h-16 shrink-0 items-center">
          <Building2 className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-secondary-900">
            PropertyMS
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
                        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-secondary-700 hover:text-primary-700 hover:bg-secondary-50'
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