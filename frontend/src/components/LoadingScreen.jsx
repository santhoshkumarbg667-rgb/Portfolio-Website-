import { useState, useEffect } from 'react'

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="loader-ring" />
                    <div className="absolute inset-0 loader-ring" style={{ animationDelay: '-0.3s', borderTopColor: '#06b6d4', opacity: 0.5 }} />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold glow-text tracking-widest">LOADING</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </span>
                </div>
            </div>
        </div>
    )
}
