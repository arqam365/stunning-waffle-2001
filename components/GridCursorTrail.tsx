'use client'

import { useEffect, useState, useRef } from 'react'

type Point = { x: number; y: number }

export function GridCursorTrail({
                                    containerId,
                                    opacity = 0.7,
                                }: {
    containerId: string
    opacity?: number
}) {
    const GRID_SIZE = 40
    const MAX_TRAIL = 40

    const [trail, setTrail] = useState<Point[]>([])
    const lastPosRef = useRef<Point | null>(null)

    useEffect(() => {
        const container = document.getElementById(containerId)
        if (!container) return

        const handleMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()

            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                return
            }

            const snappedX = Math.floor((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE
            const snappedY = Math.floor((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE

            setTrail(prev => {
                const newPoint = { x: snappedX, y: snappedY }

                // Check if same as last point
                if (prev.length > 0) {
                    const last = prev[prev.length - 1]
                    if (last.x === newPoint.x && last.y === newPoint.y) return prev
                }

                // Fill gaps when moving fast
                const pointsToAdd: Point[] = []

                if (lastPosRef.current && prev.length > 0) {
                    const dx = snappedX - lastPosRef.current.x
                    const dy = snappedY - lastPosRef.current.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const steps = Math.floor(distance / GRID_SIZE)

                    // Interpolate points between last and current
                    if (steps > 1) {
                        for (let i = 1; i < steps; i++) {
                            const t = i / steps
                            const interpX = Math.floor((lastPosRef.current.x + dx * t) / GRID_SIZE) * GRID_SIZE
                            const interpY = Math.floor((lastPosRef.current.y + dy * t) / GRID_SIZE) * GRID_SIZE
                            pointsToAdd.push({ x: interpX, y: interpY })
                        }
                    }
                }

                lastPosRef.current = newPoint

                const updated = [...prev, ...pointsToAdd, newPoint]

                // Trim from start if too long
                if (updated.length > MAX_TRAIL) {
                    return updated.slice(updated.length - MAX_TRAIL)
                }

                return updated
            })
        }

        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [containerId])

    return (
        <>
            {trail.map((point, index) => {
                const progress = index / trail.length
                const trailOpacity = progress * opacity
                const scale = 0.75 + (progress * 0.25)
                const blur = (1 - progress) * 1.5

                return (
                    <div
                        key={`${point.x}-${point.y}-${index}`}
                        className="absolute pointer-events-none"
                        style={{
                            left: point.x,
                            top: point.y,
                            width: GRID_SIZE,
                            height: GRID_SIZE,
                            backgroundColor: 'rgb(255, 200, 0)',
                            opacity: trailOpacity,
                            transform: `scale(${scale})`,
                            filter: `blur(${blur}px)`,
                            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                            zIndex: 5,
                            transformOrigin: 'center',
                            boxShadow: `0 0 ${8 * progress}px rgba(255, 200, 0, ${0.4 * progress})`,
                        }}
                    />
                )
            })}
        </>
    )
}