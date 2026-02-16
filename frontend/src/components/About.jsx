import { motion } from 'framer-motion'
import { FiCode, FiBook, FiCoffee, FiAward } from 'react-icons/fi'

const timeline = [
    { year: '2024', title: 'Started Coding Journey', desc: 'Discovered passion for Frond-end development', icon: FiCode },
    { year: '2025', title: 'First Real Projects', desc: 'Built Frond-end  applications', icon: FiCoffee },
    { year: '2026', title: 'Deep Dive into Tech', desc: 'learning React, Python, and cloud technologies', icon: FiBook },
    { year: '2026', title: 'Professional Growth', desc: 'Contributed to open source and freelance work', icon: FiAward },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
    }),
}

export default function About() {
    return (
        <section id="about" className="relative py-24 px-4">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-heading">
                        About <span className="glow-text">Me</span>
                    </h2>
                    <p className="section-subtitle">
                    
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Bio Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        className="glass-card rounded-2xl p-8"
                    >
                        <h3 className="text-2xl font-bold mb-4 text-white">
                            Who I <span className="glow-text">Am</span>
                        </h3>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                I am Santhoshkumar BG , An Electricial and Electronics Engineering Student
                                at DMI College of Engineering, Chennai. I am Passionate Student Developer
                                focused on the Electronics, Software and Innovation. I interested to the Building
                                Real-World Projects to  Solve the Problems. i learn and Adapt quickly to
                                new Challenges and Consistently giving my best Efforts in my All Works.
                            </p>
                            <p>
                                Currently pursuing my degree in Electrical and electronics Engineering Degree, I spend my free time
                                exploring new frameworks, contributing to open-source projects, and
                                turning creative ideas into reality through code.
                            </p>
                            <p>
                                BUILD IT,  TESTED IT,  UPGRADE IT,
                            </p>
                        </div>

                        {/* Interests */}
                        <div className="mt-6 pt-6 border-t border-violet/10">
                            <h4 className="text-sm font-semibold text-violet-light uppercase tracking-wider mb-3">
                                Interests
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['Frond-end Development', 'Open Source', 'Competitive Programming', 'Python Programming'].map((interest) => (
                                    <span
                                        key={interest}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-violet/10 text-violet-light border border-violet/20 hover:bg-violet/20 transition-colors"
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet/50 via-accent-cyan/30 to-transparent" />

                        {timeline.map((item, i) => (
                            <motion.div
                                key={item.year}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={fadeInUp}
                                className="relative pl-16 pb-10 last:pb-0"
                            >
                                {/* Dot */}
                                <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-dark-900 border-2 border-violet flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-violet" />
                                </div>

                                <div className="glass-card rounded-xl p-5 group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <item.icon className="text-violet-light" size={18} />
                                        <span className="text-xs font-mono text-accent-cyan">{item.year}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
