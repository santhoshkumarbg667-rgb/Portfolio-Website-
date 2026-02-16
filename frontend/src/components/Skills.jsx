import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const defaultSkills = {
    Frontend: [
        { name: 'React.js', level: 85},
        { name: 'JavaScript', level: 88 },
        { name: 'TypeScript', level: 75 },
        { name: 'HTML/CSS', level: 97 },
        { name: 'Tailwind CSS', level: 79},
    ],
    Backend: [
        { name: 'Python', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'FastAPI', level: 78 },
        { name: 'PostgreSQL', level: 75 },
        { name: 'REST APIs', level: 88 },
    ],
    Tools: [
        { name: 'Git/GitHub', level: 85 },
        { name: 'VS Code', level: 95 },
        { name: 'Antigravity', level: 65 },
        { name: 'Figma', level: 60 },
        { name: 'Thinker cart', level: 70}
    ],
    Technologies: [
        { name: 'Supabase', level: 80 },
        { name: 'Vercel', level: 85 },
        { name: 'Netlify', level: 70 },
    ],
}

const categoryColors = {
    Frontend: { ring: '#8b5cf6', trail: '#8b5cf680' },
    Backend: { ring: '#06b6d4', trail: '#06b6d480' },
    Tools: { ring: '#f59e0b', trail: '#f59e0b80' },
    Technologies: { ring: '#10b981', trail: '#10b98180' },
}

function CircularProgress({ name, level, color, delay }) {
    const [animated, setAnimated] = useState(false)
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (level / 100) * circumference

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            onViewportEnter={() => setAnimated(true)}
            className="flex flex-col items-center gap-2 group"
        >
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    {/* Background circle */}
                    <circle
                        cx="48" cy="48" r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="48" cy="48" r={radius}
                        fill="none"
                        stroke={color.ring}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={animated ? offset : circumference}
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 6px ${color.trail})` }}
                    />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform">
                        {level}%
                    </span>
                </div>
            </div>
            <span className="text-sm text-slate-300 font-medium text-center">{name}</span>
        </motion.div>
    )
}

export default function Skills() {
    const [activeCategory, setActiveCategory] = useState('Frontend')
    const [skills, setSkills] = useState(defaultSkills)

    useEffect(() => {
        async function fetchSkills() {
            try {
                const { data, error } = await supabase
                    .from('skills')
                    .select('*')
                    .order('created_at', { ascending: true })
                if (!error && data && data.length > 0) {
                    const grouped = {}
                    data.forEach((s) => {
                        const cat = s.category || 'Other'
                        if (!grouped[cat]) grouped[cat] = []
                        grouped[cat].push({ name: s.name, level: s.level })
                    })
                    setSkills(grouped)
                    setActiveCategory(Object.keys(grouped)[0])
                }
            } catch {
                // Use defaults
            }
        }
        fetchSkills()
    }, [])

    const categories = Object.keys(skills)

    return (
        <section id="skills" className="relative py-24 px-4">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-heading">
                        My <span className="glow-text">Skills</span>
                    </h2>
                    <p className="section-subtitle">
                        Technologies and tools I work with on a daily basis.
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-violet/20 text-violet-light border border-violet/40 shadow-lg shadow-violet/10'
                                    : 'text-slate-400 border border-white/5 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Skills Grid */}
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card rounded-2xl p-8"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center">
                        {(skills[activeCategory] || []).map((skill, i) => (
                            <CircularProgress
                                key={skill.name}
                                name={skill.name}
                                level={skill.level}
                                color={categoryColors[activeCategory] || categoryColors.Frontend}
                                delay={i * 0.1}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
