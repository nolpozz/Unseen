import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Palette, Calendar, Sparkles, Home, ShoppingBag } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/artists', label: 'Artists', icon: Palette },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/ai-art', label: 'AI Art', icon: Sparkles },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag }
  ]

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Unseen
            </h1>
          </Link>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                style={{
                  textDecoration: 'none',
                  color: location.pathname === path ? '#667eea' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  background: location.pathname === path ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                }}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 