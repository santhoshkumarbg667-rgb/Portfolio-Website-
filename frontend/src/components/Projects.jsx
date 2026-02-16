import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import ProjectCard from './ProjectCard'

const defaultProjects = [
    {
        id: '1',
        title: 'AI Chat Application',
        description: 'A real-time chat app powered by AI with natural language processing and smart replies.',
        tech_stack: ['React', 'Python', 'OpenAI', 'WebSocket'],
        category: 'fullstack',
        image_url: '',
        live_url: '#',
        github_url: '#',
    },
    {
        id: '2',
        title: 'E-Commerce Dashboard',
        description: 'Modern admin dashboard with analytics, order management, and responsive charts.',
        tech_stack: ['Next.js', 'Tailwind', 'Supabase', 'Chart.js'],
        category: 'frontend',
        image_url: '',
        live_url: '#',
        github_url: '#',
    },
    {
        id: '3',
        title: 'Task Manager API',
        description: 'RESTful API for task management with auth, CRUD operations, and real-time sync.',
        tech_stack: ['FastAPI', 'PostgreSQL', 'Docker', 'JWT'],
        category: 'backend',
        image_url: '',
        live_url: '#',
        github_url: '#',
    },
    {
        id: '4',
        title: 'Portfolio Template',
        description: 'Animated developer portfolio with dark theme, glassmorphism, and particle effects.',
        tech_stack: ['React', 'Framer Motion', 'Tailwind'],
        category: 'frontend',
        image_url: '',
        live_url: '#',
        github_url: '#',
    },
]

const categories = ['all', 'frontend', 'backend', 'fullstack', 'other']

export default function Projects() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [projects, setProjects] = useState(defaultProjects)

    useEffect(() => {
        async function fetchProjects() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false })
                if (!error && data && data.length > 0) {
                    setProjects(data)
                }
            } catch {
                // Use defaults
            }
        }
        fetchProjects()
    }, [])

    const filtered =
        activeFilter === 'all'
            ? projects
            : projects.filter((p) => p.category === activeFilter)

    return (
        <section id="projects" className="relative py-24 px-4">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-heading">
                        My <span className="glow-text">Projects</span>
                    </h2>
                    <p className="section-subtitle">
                        A showcase of my recent work and passion projects.
                    </p>
                </motion.div>

                {/* Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${activeFilter === cat
                                    ? 'bg-violet/20 text-violet-light border border-violet/40 shadow-lg shadow-violet/10'
                                    : 'text-slate-400 border border-white/5 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}
                <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <p className="text-center text-slate-500 mt-12">
                        No projects in this category yet.
                    </p>
                )}
            </div>
        </section>
    )
}
