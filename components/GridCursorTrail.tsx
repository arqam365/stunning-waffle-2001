'use client'

import { useEffect, useState } from 'react'

type Point = { x: number; y: number }

export function GridCursorTrail({
                                    containerId,
                                }: {
    containerId: string
}) {
    const GRID_SIZE = 40
    const MAX_TRAIL = 30

    const [trail, setTrail] = useState<Point[]>([])

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

            const snappedX =
                Math.floor((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE

            const snappedY =
                Math.floor((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE

            setTrail(prev => {
                const newPoint = { x: snappedX, y: snappedY }

                if (prev.length > 0) {
                    const last = prev[prev.length - 1]
                    if (last.x === newPoint.x && last.y === newPoint.y) return prev
                }

                const updated = [...prev, newPoint]
                if (updated.length > MAX_TRAIL) updated.shift()

                return updated
            })
        }

        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [containerId])

    return (
        <>
            {trail.map((point, index) => (
                <div
                    key={index}
                    className="absolute bg-accent/70 transition-opacity duration-500"
                    style={{
                        left: point.x,
                        top: point.y,
                        width: GRID_SIZE,
                        height: GRID_SIZE,
                        opacity: index / trail.length,
                    }}
                />
            ))}
        </>
    )
}