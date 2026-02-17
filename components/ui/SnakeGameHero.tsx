'use client'

import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }
type Direction = { x: number; y: number }
type GameState = 'idle' | 'playing' | 'dead'

const GRID = 40
const SPEED = 120

function spawnFood(cols: number, rows: number, snakeBody: Point[]): Point {
    let food: Point
    do {
        food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
        }
    } while (snakeBody.some(p => p.x === food.x && p.y === food.y))
    return food
}

interface SnakeGameHeroProps {
    containerId: string
    isActive: boolean
    onActivate: () => void
    onDeactivate: () => void
}

export function SnakeGameHero({
                                  containerId,
                                  isActive,
                                  onActivate,
                                  onDeactivate,
                              }: SnakeGameHeroProps) {
    // Sync all props to refs immediately — never put in useEffect deps
    const onActivateRef   = useRef(onActivate)
    const onDeactivateRef = useRef(onDeactivate)
    const isActiveRef     = useRef(isActive)
    onActivateRef.current   = onActivate
    onDeactivateRef.current = onDeactivate
    isActiveRef.current     = isActive

    // All game state in refs — zero setState inside game loop
    const dirRef      = useRef<Direction>({ x: 1, y: 0 })
    const nextDirRef  = useRef<Direction>({ x: 1, y: 0 })
    const snakeRef    = useRef<Point[]>([])
    const foodRef     = useRef<Point>({ x: 0, y: 0 })
    const stateRef    = useRef<GameState>('idle')
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const scoreRef    = useRef(0)
    const highRef     = useRef(0)

    // Single render state object — one setState per tick
    const [rs, setRs] = useState<{ gs: GameState; score: number; high: number }>({
        gs: 'idle', score: 0, high: 0,
    })

    const flush = () =>
        setRs({ gs: stateRef.current, score: scoreRef.current, high: highRef.current })

    // ── Resolve container with retry until found ───────────────────────────
    function getContainer(): HTMLElement | null {
        return document.getElementById(containerId)
    }

    function getGridDims() {
        const el = getContainer()
        if (!el) return { cols: 0, rows: 0 }
        return {
            cols: Math.floor(el.offsetWidth / GRID),
            rows: Math.floor(el.offsetHeight / GRID),
        }
    }

    // ── Game logic — plain functions, no closures over React state ─────────
    function stopLoop() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    function startGame() {
        // Retry container resolution — poll until ready
        const el = getContainer()
        if (!el || el.offsetWidth === 0) {
            setTimeout(startGame, 50)
            return
        }

        stopLoop()

        const { cols, rows } = getGridDims()
        const init: Point[] = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]

        snakeRef.current  = init
        dirRef.current    = { x: 1, y: 0 }
        nextDirRef.current = { x: 1, y: 0 }
        foodRef.current   = spawnFood(cols, rows, init)
        scoreRef.current  = 0
        stateRef.current  = 'playing'

        onActivateRef.current()
        flush()

        intervalRef.current = setInterval(() => {
            if (stateRef.current !== 'playing') return

            dirRef.current = nextDirRef.current

            const { cols: c, rows: r } = getGridDims()
            if (!c || !r) return

            const snake   = snakeRef.current
            const dir     = dirRef.current
            const newHead = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

            // Wall collision
            if (newHead.x < 0 || newHead.y < 0 || newHead.x >= c || newHead.y >= r) {
                stateRef.current = 'dead'
                highRef.current  = Math.max(highRef.current, scoreRef.current)
                stopLoop()
                flush()
                return
            }

            // Self collision
            if (snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
                stateRef.current = 'dead'
                highRef.current  = Math.max(highRef.current, scoreRef.current)
                stopLoop()
                flush()
                return
            }

            const ate      = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y
            snakeRef.current = ate ? [newHead, ...snake] : [newHead, ...snake.slice(0, -1)]

            if (ate) {
                scoreRef.current += 10
                foodRef.current   = spawnFood(c, r, snakeRef.current)
            }

            flush()
        }, SPEED)
    }

    function exitGame() {
        stopLoop()
        stateRef.current = 'idle'
        flush()
        onDeactivateRef.current()
    }

    // ── Watch isActive via polling — completely avoids dep-chain loops ─────
    useEffect(() => {
        let last = isActiveRef.current

        const poll = setInterval(() => {
            const cur = isActiveRef.current
            if (cur === last) return
            last = cur

            if (cur && stateRef.current === 'idle') startGame()
            if (!cur && stateRef.current !== 'idle') {
                stopLoop()
                stateRef.current = 'idle'
                flush()
            }
        }, 30)

        // Also start immediately if already active on mount
        if (isActiveRef.current && stateRef.current === 'idle') {
            // Defer by one frame to ensure container is in DOM
            requestAnimationFrame(() => startGame())
        }

        return () => clearInterval(poll)
    }, []) // intentionally empty — reads only refs

    // ── Arrow key controls — reads only refs, fully stable ────────────────
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
            if (arrows.includes(e.key) && stateRef.current === 'playing') {
                e.preventDefault()
            }
            if (stateRef.current !== 'playing') return
            const cur = dirRef.current
            switch (e.key) {
                case 'ArrowUp':    if (cur.y !== 1)  nextDirRef.current = { x: 0, y: -1 }; break
                case 'ArrowDown':  if (cur.y !== -1) nextDirRef.current = { x: 0, y: 1 };  break
                case 'ArrowLeft':  if (cur.x !== 1)  nextDirRef.current = { x: -1, y: 0 }; break
                case 'ArrowRight': if (cur.x !== -1) nextDirRef.current = { x: 1, y: 0 };  break
            }
        }
        window.addEventListener('keydown', handle)
        return () => window.removeEventListener('keydown', handle)
    }, [])

    useEffect(() => () => stopLoop(), [])

    // ── Render ─────────────────────────────────────────────────────────────
    const { gs, score, high } = rs
    const isPlaying = gs === 'playing'
    const isDead    = gs === 'dead'

    if (!isActive && !isDead) return null

    return (
        <>
            {/* Snake segments */}
            {(isPlaying || isDead) && snakeRef.current.map((seg, i) => {
                const isHead = i === 0
                const alpha  = isHead ? 1 : Math.max(0.2, 1 - (i / snakeRef.current.length) * 0.8)
                return (
                    <div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                            left:            seg.x * GRID,
                            top:             seg.y * GRID,
                            width:           GRID,
                            height:          GRID,
                            backgroundColor: isHead
                                ? `rgba(0,255,200,${alpha})`
                                : `rgba(0,210,165,${alpha})`,
                            boxShadow: isHead ? '0 0 12px rgba(0,255,200,0.7)' : 'none',
                            zIndex:    6,
                        }}
                    />
                )
            })}

            {/* Food */}
            {(isPlaying || isDead) && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        left:            foodRef.current.x * GRID,
                        top:             foodRef.current.y * GRID,
                        width:           GRID,
                        height:          GRID,
                        backgroundColor: 'rgba(255,75,75,0.9)',
                        boxShadow:       '0 0 14px rgba(255,75,75,0.8)',
                        zIndex:          6,
                    }}
                />
            )}

            {/* Score */}
            {isPlaying && (
                <div className="absolute top-24 right-6 z-20 font-mono text-xs pointer-events-none select-none space-y-0.5">
                    <div className="text-muted-foreground/50">
                        SCORE <span className="text-accent font-bold">{score}</span>
                    </div>
                    <div className="text-muted-foreground/30">
                        BEST <span className="text-accent/50 font-bold">{high}</span>
                    </div>
                </div>
            )}

            {/* Game over */}
            {isDead && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="font-mono text-sm tracking-widest text-red-400/80">GAME OVER</div>
                        <div className="font-mono text-xs text-muted-foreground/60">
                            score: <span className="text-accent">{score}</span>
                            {score > 0 && score >= high && (
                                <span className="ml-2 text-accent/60">🏆 new best</span>
                            )}
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={startGame}
                                className="px-5 py-2 text-xs font-mono border border-accent/40 text-accent/80 rounded
                  hover:bg-accent hover:text-background transition-all duration-200 tracking-widest"
                            >
                                PLAY AGAIN
                            </button>
                            <button
                                onClick={exitGame}
                                className="px-5 py-2 text-xs font-mono border border-muted-foreground/20 text-muted-foreground/40 rounded
                  hover:border-muted-foreground/40 hover:text-muted-foreground/60 transition-all duration-200 tracking-widest"
                            >
                                EXIT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}