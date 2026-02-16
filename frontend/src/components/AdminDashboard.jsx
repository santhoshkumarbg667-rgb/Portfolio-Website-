import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ProjectFormModal from './ProjectFormModal'
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiLogOut, FiHome } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
    const { user, signOut } = useAuth()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editProject, setEditProject] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const fetchProjects = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })
        setProjects(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleSave = async (payload, id) => {
        if (id) {
            await supabase.from('projects').update(payload).eq('id', id)
        } else {
            await supabase.from('projects').insert([payload])
        }
        fetchProjects()
    }

    const handleDelete = async (id) => {
        await supabase.from('projects').delete().eq('id', id)
        setDeleteConfirm(null)
        fetchProjects()
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            Admin <span className="glow-text">Dashboard</span>
                        </h1>
                        <p className="text-sm text-slate-400">
                            Manage your portfolio projects • {user?.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                            <FiHome size={16} /> Home
                        </Link>
                        <button onClick={signOut} className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <FiLogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Add Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setEditProject(null); setModalOpen(true) }}
                    className="w-full mb-8 py-4 rounded-2xl border-2 border-dashed border-violet/30 hover:border-violet/60 text-violet-light hover:text-violet flex items-center justify-center gap-3 transition-all duration-300 hover:bg-violet/5"
                >
                    <FiPlus size={20} />
                    <span className="font-semibold">Add New Project</span>
                </motion.button>

                {/* Projects List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="loader-ring" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">No projects yet. Click above to add your first one!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card rounded-xl p-5 flex items-center gap-4"
                            >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-violet/20 to-accent-cyan/20 flex items-center justify-center">
                                            <span className="text-lg font-bold glow-text">{project.title?.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{project.title}</h3>
                                    <p className="text-sm text-slate-400 truncate">{project.description}</p>
                                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                        {(project.tech_stack || []).slice(0, 3).map((t) => (
                                            <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-violet/10 text-violet-light">{t}</span>
                                        ))}
                                        {(project.tech_stack || []).length > 3 && (
                                            <span className="text-[10px] text-slate-500">+{project.tech_stack.length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {project.live_url && (
                                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                                            className="p-2 rounded-lg text-slate-400 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all">
                                            <FiExternalLink size={16} />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => { setEditProject(project); setModalOpen(true) }}
                                        className="p-2 rounded-lg text-slate-400 hover:text-violet-light hover:bg-violet/10 transition-all"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    {deleteConfirm === project.id ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(project.id)}
                                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <ProjectFormModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditProject(null) }}
                onSave={handleSave}
                editProject={editProject}
            />
        </div>
    )
}
