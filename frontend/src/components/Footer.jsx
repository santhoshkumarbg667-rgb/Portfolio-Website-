import { FiHeart } from 'react-icons/fi'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="relative py-8 px-4 border-t border-white/5">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                    © {year} <span className="glow-text font-semibold">&lt;Dev /&gt;</span>. All rights reserved.
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    Built with <FiHeart className="text-red-500 animate-pulse" size={14} /> using React & Tailwind
                </div>
            </div>
        </footer>
    )
}
