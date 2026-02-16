import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

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
    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState('')

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
            setImagePreview(editProject.image_url || '')
        } else {
            setForm({
                title: '', description: '', tech_stack: '',
                category: 'frontend', image_url: '', live_url: '', github_url: '',
            })
            setImagePreview('')
        }
    }, [editProject, isOpen])

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB')
            return
        }

        setUploading(true)
        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `projects/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('project-images')
                .getPublicUrl(fileName)

            const publicUrl = urlData.publicUrl
            setForm({ ...form, image_url: publicUrl })
            setImagePreview(publicUrl)
        } catch (err) {
            console.error('Upload failed:', err)
            alert('Failed to upload image. Make sure the "project-images" bucket exists in Supabase Storage.')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        setForm({ ...form, image_url: '' })
        setImagePreview('')
    }

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

                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Image</label>
                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-white/10">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-all"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-violet/40 bg-white/5 cursor-pointer transition-all duration-300 hover:bg-violet/5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-violet/30 border-t-violet rounded-full animate-spin" />
                                        <span className="text-xs text-slate-400">Uploading...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <FiUpload className="text-slate-500" size={24} />
                                        <span className="text-xs text-slate-400">Click to upload image</span>
                                        <span className="text-[10px] text-slate-600">PNG, JPG up to 5MB</span>
                                    </div>
                                )}
                            </label>
                        )}
                        {/* Or paste URL */}
                        <div className="mt-2 flex items-center gap-2">
                            <FiImage className="text-slate-500" size={14} />
                            <input
                                type="text"
                                value={form.image_url}
                                onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setImagePreview(e.target.value) }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 transition-all text-xs"
                                placeholder="Or paste image URL here"
                            />
                        </div>
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
