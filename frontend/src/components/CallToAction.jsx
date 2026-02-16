import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiLinkedin, FiGithub, FiMail, FiSend, FiCheck } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const socials = [
    {
        name: 'LinkedIn',
        icon: FiLinkedin,
        href: 'https://www.linkedin.com/in/santhoshkumar-bg',
        color: 'from-blue-600 to-blue-400',
        glow: 'rgba(59, 130, 246, 0.4)',
    },
    {
        name: 'GitHub',
        icon: FiGithub,
        href: 'https://github.com/santhoshkumarbg667-rgb',
        color: 'from-violet to-purple-400',
        glow: 'rgba(139, 92, 246, 0.4)',
    },
    {
        name: 'Gmail',
        icon: FiMail,
        href: 'mailto:santhoshkumarbg667@gmail.com',
        color: 'from-red-500 to-orange-400',
        glow: 'rgba(239, 68, 68, 0.4)',
    },
]

export default function CallToAction() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState('idle') // idle | sending | sent | error

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const { error } = await supabase.from('messages').insert([
                { name: form.name, email: form.email, message: form.message },
            ])
            if (error) throw error
            setStatus('sent')
            setForm({ name: '', email: '', message: '' })
            setTimeout(() => setStatus('idle'), 4000)
        } catch {
            setStatus('error')
            setTimeout(() => setStatus('idle'), 4000)
        }
    }

    return (
        <section id="contact" className="relative py-24 px-4">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-heading">
                        Get In <span className="glow-text">Touch</span>
                    </h2>
                    <p className="section-subtitle">
                        Let's connect! Feel free to reach out through any platform or drop a message below.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Social Icons + Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">
                            Connect with <span className="glow-text">Me</span>
                        </h3>

                        <div className="flex gap-6 mb-10">
                            {socials.map((social, i) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -8, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative"
                                >
                                    {/* Glow background */}
                                    <div
                                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                                        style={{ background: social.glow }}
                                    />
                                    <div
                                        className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg transition-all duration-300`}
                                        style={{
                                            animation: 'glow-pulse 3s ease-in-out infinite',
                                            animationDelay: `${i * 0.5}s`,
                                        }}
                                    >
                                        <social.icon size={26} />
                                    </div>
                                    <span className="block text-center text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">
                                        {social.name}
                                    </span>
                                </motion.a>
                            ))}
                        </div>

                        <div className="glass-card rounded-2xl p-6 w-full">
                            <p className="text-slate-300 leading-relaxed">
                                I'm always open to discussing new projects, creative ideas, or
                                opportunities to be part of your vision. Whether you have a question
                                or just want to say hi — my inbox is always open!
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition-all"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition-all resize-none"
                                    placeholder="Your message..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${status === 'sent'
                                        ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                        : status === 'error'
                                            ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                            : 'btn-primary'
                                    }`}
                            >
                                {status === 'sending' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : status === 'sent' ? (
                                    <>
                                        <FiCheck size={18} />
                                        Message Sent!
                                    </>
                                ) : status === 'error' ? (
                                    'Failed — Try Again'
                                ) : (
                                    <>
                                        <FiSend size={16} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
