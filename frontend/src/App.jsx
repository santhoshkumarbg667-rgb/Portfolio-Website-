import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function HomePage() {
    return (
        <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <CallToAction />
        </>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="relative min-h-screen">
                    <LoadingScreen />
                    <ParticleBackground />
                    <CustomCursor />
                    <Navbar />

                    <main className="relative z-10">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<AdminLogin />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    )
}
