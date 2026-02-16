import { motion } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

export default function ProjectCard({ project }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl overflow-hidden group glow-border"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                {project.image_url ? (
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet/20 to-accent-cyan/20 flex items-center justify-center">
                        <span className="text-4xl font-bold glow-text opacity-50">
                            {project.title?.charAt(0) || 'P'}
                        </span>
                    </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Links overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full bg-violet/80 hover:bg-violet flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg shadow-violet/30"
                        >
                            <FiExternalLink size={18} />
                        </a>
                    )}
                    {project.github_url && (
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                        >
                            <FiGithub size={18} />
                        </a>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-light transition-colors">
                    {project.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                    {(project.tech_stack || []).map((tech) => (
                        <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-violet/10 text-violet-light border border-violet/10"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
