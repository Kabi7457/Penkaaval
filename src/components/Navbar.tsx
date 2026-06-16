import { useState, useEffect } from 'react'
import { Menu, X, Shield } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Join Our Team', href: '#join' },
  { name: 'Vision & Mission', href: '#vision' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact Us', href: '#contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navLinks.map(link => link.href.slice(1))
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (href: string) => {
    setIsOpen(false)
    const el = document.getElementById(href.slice(1))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0118]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleClick('#home') }}
            className="flex items-center gap-3 group"
            id="logo-link"
          >
            <div className="relative">
              <Shield className="w-9 h-9 text-purple-400 transition-all duration-300 group-hover:text-purple-300" />
              <div className="absolute inset-0 w-9 h-9 bg-purple-500/20 rounded-full blur-lg group-hover:bg-purple-400/30 transition-all duration-300" />
            </div>
            <span className="text-2xl font-bold font-display text-gradient">PenKaaval</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleClick(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-white bg-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                id={`nav-${link.href.slice(1)}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            id="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#0a0118]/95 backdrop-blur-2xl border-t border-white/5 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleClick(link.href)}
              className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeSection === link.href.slice(1)
                  ? 'text-white bg-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
