import { useState, useEffect } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useAuth } from '../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const progress = useScrollProgress()
    const { user, signOut } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (location.pathname !== '/') return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
        )
        navLinks.forEach(({ href }) => {
            const el = document.querySelector(href)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [location.pathname])

    const handleNavClick = (href) => {
        setMobileOpen(false)
        if (location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } else {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <>
            {/* Scroll Progress */}
            <div className="scroll-progress" style={{ width: `${progress}%` }} />

            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? 'glass py-3 shadow-lg shadow-violet/5'
                        : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <button
                        onClick={() => handleNavClick('#home')}
                        className="text-xl font-bold glow-text hover:scale-105 transition-transform"
                    >
                        &lt;SK PORTFOLIO WEB /&gt;
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ label, href }) => (
                            <button
                                key={href}
                                onClick={() => handleNavClick(href)}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${activeSection === href.slice(1)
                                        ? 'text-violet-light'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {label}
                                {activeSection === href.slice(1) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-violet rounded-full" />
                                )}
                            </button>
                        ))}
                        {user ? (
                            <div className="flex items-center gap-2 ml-4">
                                <Link
                                    to="/admin"
                                    className="btn-outline text-xs py-2 px-4"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={signOut}
                                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                    title="Sign Out"
                                >
                                    <FiLogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/admin" className="btn-primary text-xs py-2 px-4 ml-4">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden absolute top-full left-0 right-0 glass overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 border-t border-violet/10' : 'max-h-0'
                        }`}
                >
                    <div className="px-4 py-4 flex flex-col gap-1">
                        {navLinks.map(({ label, href }) => (
                            <button
                                key={href}
                                onClick={() => handleNavClick(href)}
                                className={`text-left px-4 py-3 rounded-lg transition-all duration-300 ${activeSection === href.slice(1)
                                        ? 'text-violet-light bg-violet/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                        <Link
                            to="/admin"
                            className="btn-primary text-center text-sm mt-2"
                            onClick={() => setMobileOpen(false)}
                        >
                            {user ? 'Dashboard' : 'Admin'}
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}
