'use client'

import { useEffect, useRef } from 'react'

export function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current!
    const trail = trailRef.current!

    let mouseX = 0
    let mouseY = 0
    let trailX = 0
    let trailY = 0

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.15
      trailY += (mouseY - trailY) * 0.15

      trail.style.transform = `translate(${trailX}px, ${trailY}px)`
      requestAnimationFrame(animateTrail)
    }

    document.addEventListener('mousemove', moveCursor)
    requestAnimationFrame(animateTrail)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  return (
      <>
        <div
            ref={trailRef}
            className="fixed top-0 left-0 w-8 h-8 bg-accent/20 rounded-full pointer-events-none blur-md z-[9999]"
        />
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[10000]"
        />
      </>
  )
}