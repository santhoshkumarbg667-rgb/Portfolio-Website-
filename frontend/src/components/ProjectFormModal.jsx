import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProjectFormModal({ isOpen, onClose, onSave, editProject }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        tech_stack: '',
        category: 'frontend',
        image_url: '',
        live_url: '',
        github_url: '',
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (editProject) {
            setForm({
                title: editProject.title || '',
                description: editProject.description || '',
                tech_stack: (editProject.tech_stack || []).join(', '),
                category: editProject.category || 'frontend',
                image_url: editProject.image_url || '',
                live_url: editProject.live_url || '',
                github_url: editProject.github_url || '',
            })
        } else {
            setForm({
                title: '', description: '', tech_stack: '',
                category: 'frontend', image_url: '', live_url: '', github_url: '',
            })
        }
    }, [editProject, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        const payload = {
            ...form,
            tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        }
        await onSave(payload, editProject?.id)
        setSaving(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass-card rounded-2xl p-8 max-h-[90vh] overflow-y-auto z-10"
            >
                <h3 className="text-xl font-bold text-white mb-6">
                    {editProject ? 'Edit Project' : 'Add New Project'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
                        <input
                            type="text" required value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 transition-all text-sm"
                            placeholder="Project name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
                        <textarea
                            required rows={3} value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 transition-all text-sm resize-none"
                            placeholder="Brief project description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Tech Stack</label>
                        <input
                            type="text" value={form.tech_stack}
                            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 transition-all text-sm"
                            placeholder="React, Python, FastAPI (comma separated)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet/50 transition-all text-sm"
                            >
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="fullstack">Fullstack</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Image URL</label>
                            <input
                                type="text" value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 transition-all text-sm"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Live URL</label>
                            <input
                                type="text" value={form.live_url}
                                onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 transition-all text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">GitHub URL</label>
                            <input
                                type="text" value={form.github_url}
                                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 transition-all text-sm"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-outline flex-1 text-sm py-2.5">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2">
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : editProject ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
