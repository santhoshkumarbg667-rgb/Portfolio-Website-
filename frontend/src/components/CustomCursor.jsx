import { useEffect, useState } from 'react'

export default function CustomCursor() {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const [visible, setVisible] = useState(false)
    const [clicking, setClicking] = useState(false)

    useEffect(() => {
        // Only show on desktop
        if (window.matchMedia('(pointer: coarse)').matches) return

        const move = (e) => {
            setPos({ x: e.clientX, y: e.clientY })
            setVisible(true)
        }
        const down = () => setClicking(true)
        const up = () => setClicking(false)
        const leave = () => setVisible(false)
        const enter = () => setVisible(true)

        window.addEventListener('mousemove', move)
        window.addEventListener('mousedown', down)
        window.addEventListener('mouseup', up)
        document.addEventListener('mouseleave', leave)
        document.addEventListener('mouseenter', enter)

        return () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mousedown', down)
            window.removeEventListener('mouseup', up)
            document.removeEventListener('mouseleave', leave)
            document.removeEventListener('mouseenter', enter)
        }
    }, [])

    if (!visible) return null

    return (
        <>
            {/* Outer ring */}
            <div
                className="fixed pointer-events-none z-[9998] rounded-full border border-violet/40 transition-transform duration-300 ease-out"
                style={{
                    width: clicking ? '28px' : '36px',
                    height: clicking ? '28px' : '36px',
                    left: pos.x - (clicking ? 14 : 18),
                    top: pos.y - (clicking ? 14 : 18),
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
                }}
            />
            {/* Inner dot */}
            <div
                className="fixed pointer-events-none z-[9998] rounded-full bg-violet transition-transform duration-100"
                style={{
                    width: clicking ? '6px' : '4px',
                    height: clicking ? '6px' : '4px',
                    left: pos.x - (clicking ? 3 : 2),
                    top: pos.y - (clicking ? 3 : 2),
                }}
            />
        </>
    )
}
