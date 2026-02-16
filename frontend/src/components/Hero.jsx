import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const roles = ['Frond-end Developer', 'Problem Solver', 'Python Programmer', 'Enthusiastic Learner']

export default function Hero() {
    const [roleIndex, setRoleIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentRole = roles[roleIndex]
        let timeout

        if (!isDeleting && displayText === currentRole) {
            timeout = setTimeout(() => setIsDeleting(true), 2000)
        } else if (isDeleting && displayText === '') {
            setIsDeleting(false)
            setRoleIndex((prev) => (prev + 1) % roles.length)
        } else {
            timeout = setTimeout(() => {
                setDisplayText(
                    isDeleting
                        ? currentRole.substring(0, displayText.length - 1)
                        : currentRole.substring(0, displayText.length + 1)
                )
            }, isDeleting ? 40 : 80)
        }

        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, roleIndex])

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center px-4 pt-20"
        >
            <div className="max-w-5xl mx-auto text-center relative z-10">
                {/* Profile Image */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                    className="mb-8"
                >
                    <div className="relative inline-block">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-violet/40 p-1 animate-glow-pulse">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-violet/30 to-accent-cyan/30 flex items-center justify-center">
                                <span className="text-4xl md:text-5xl font-bold glow-text">S</span>
                            </div>
                        </div>
                        {/* Online indicator */}
                        <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900 animate-pulse" />
                    </div>
                </motion.div>

                {/* Greeting */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-violet-light text-lg md:text-xl font-mono mb-4"
                >
                    {'// Hello, World! I\'m'}
                </motion.p>

                {/* Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
                >
                    <span className="glow-text">Santhoshkumar BG</span>
                </motion.h1>

                {/* Typewriter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="h-10 md:h-12 flex items-center justify-center mb-8"
                >
                    <span className="text-xl md:text-2xl text-slate-300 font-light">
                        {displayText}
                    </span>
                    <span className="ml-1 w-0.5 h-6 md:h-7 bg-violet-light animate-blink" />
                </motion.div>

                {/* Passion Statement */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <button
                        onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-primary text-base"
                    >
                        View My Work
                    </button>
                    <button
                        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-outline text-base"
                    >
                        Get In Touch
                    </button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-violet/30 rounded-full flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 rounded-full bg-violet"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
