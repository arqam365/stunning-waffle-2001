'use client'

import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }
type GameState = 'idle' | 'playing' | 'dead'
type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

const GRID = 40
const COLS = 10
const ROWS = 20
const INITIAL_SPEED = 800

// Tetromino shapes
const SHAPES: Record<TetrominoType, Point[]> = {
    I: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
    O: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    T: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    S: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    Z: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    J: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    L: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
}

const COLORS: Record<TetrominoType, string> = {
    I: 'rgba(0, 255, 255, 0.9)',
    O: 'rgba(255, 255, 0, 0.9)',
    T: 'rgba(160, 0, 255, 0.9)',
    S: 'rgba(0, 255, 100, 0.9)',
    Z: 'rgba(255, 0, 0, 0.9)',
    J: 'rgba(0, 100, 255, 0.9)',
    L: 'rgba(255, 160, 0, 0.9)',
}

interface TetrisGameHeroProps {
    containerId: string
    isActive: boolean
    onActivate: () => void
    onDeactivate: () => void
}

export function TetrisGameHero({ containerId, isActive, onActivate, onDeactivate }: TetrisGameHeroProps) {
    const onActivateRef = useRef(onActivate)
    const onDeactivateRef = useRef(onDeactivate)
    onActivateRef.current = onActivate
    onDeactivateRef.current = onDeactivate

    const stateRef = useRef<GameState>('idle')
    const boardRef = useRef<(TetrominoType | null)[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)))
    const currentRef = useRef<{ type: TetrominoType; x: number; y: number; shape: Point[] } | null>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const scoreRef = useRef(0)
    const linesRef = useRef(0)
    const levelRef = useRef(1)
    const speedRef = useRef(INITIAL_SPEED)

    const [rs, setRs] = useState<{ gs: GameState; score: number; lines: number; level: number }>({
        gs: 'idle',
        score: 0,
        lines: 0,
        level: 1,
    })

    const flush = () => setRs({ gs: stateRef.current, score: scoreRef.current, lines: linesRef.current, level: levelRef.current })

    function getContainer(): HTMLElement | null {
        return document.getElementById(containerId)
    }

    function getGridOffset() {
        const el = getContainer()
        if (!el) return { x: 0, y: 0 }
        const totalWidth = COLS * GRID
        const totalHeight = ROWS * GRID
        return {
            x: (el.offsetWidth - totalWidth) / 2,
            y: (el.offsetHeight - totalHeight) / 2,
        }
    }

    function randomTetromino(): { type: TetrominoType; shape: Point[] } {
        const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
        const type = types[Math.floor(Math.random() * types.length)]
        return { type, shape: SHAPES[type] }
    }

    function rotate(shape: Point[]): Point[] {
        // Rotate 90° clockwise
        return shape.map(({ x, y }) => ({ x: -y, y: x }))
    }

    function collides(x: number, y: number, shape: Point[]): boolean {
        return shape.some(p => {
            const newX = x + p.x
            const newY = y + p.y
            if (newX < 0 || newX >= COLS || newY >= ROWS) return true
            if (newY >= 0 && boardRef.current[newY][newX]) return true
            return false
        })
    }

    function mergePiece() {
        if (!currentRef.current) return
        const { type, x, y, shape } = currentRef.current
        shape.forEach(p => {
            const newY = y + p.y
            const newX = x + p.x
            if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
                boardRef.current[newY][newX] = type
            }
        })
    }

    function clearLines() {
        let cleared = 0
        for (let row = ROWS - 1; row >= 0; row--) {
            if (boardRef.current[row].every(cell => cell !== null)) {
                boardRef.current.splice(row, 1)
                boardRef.current.unshift(Array(COLS).fill(null))
                cleared++
                row++ // Check same row again
            }
        }
        if (cleared > 0) {
            linesRef.current += cleared
            scoreRef.current += cleared * 100 * levelRef.current
            levelRef.current = Math.floor(linesRef.current / 10) + 1
            speedRef.current = Math.max(100, INITIAL_SPEED - (levelRef.current - 1) * 50)
            startLoop() // Restart with new speed
        }
    }

    function spawnPiece() {
        const { type, shape } = randomTetromino()
        const x = Math.floor(COLS / 2) - 1
        const y = 0
        if (collides(x, y, shape)) {
            stateRef.current = 'dead'
            flush()
            stopLoop()
            return false
        }
        currentRef.current = { type, x, y, shape }
        return true
    }

    function moveDown() {
        if (!currentRef.current) return
        const { x, y, shape } = currentRef.current
        if (!collides(x, y + 1, shape)) {
            currentRef.current.y++
        } else {
            mergePiece()
            clearLines()
            if (!spawnPiece()) return
        }
        flush()
    }

    function moveHorizontal(dx: number) {
        if (!currentRef.current) return
        const { x, y, shape } = currentRef.current
        if (!collides(x + dx, y, shape)) {
            currentRef.current.x += dx
            flush()
        }
    }

    function rotatePiece() {
        if (!currentRef.current) return
        const { x, y, shape } = currentRef.current
        const rotated = rotate(shape)
        if (!collides(x, y, rotated)) {
            currentRef.current.shape = rotated
            flush()
        }
    }

    function hardDrop() {
        if (!currentRef.current) return
        const { x, y, shape } = currentRef.current
        let dropY = y
        while (!collides(x, dropY + 1, shape)) {
            dropY++
        }
        currentRef.current.y = dropY
        scoreRef.current += (dropY - y) * 2
        mergePiece()
        clearLines()
        if (!spawnPiece()) return
        flush()
    }

    function stopLoop() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    function startLoop() {
        stopLoop()
        intervalRef.current = setInterval(() => {
            if (stateRef.current === 'playing') {
                moveDown()
            }
        }, speedRef.current)
    }

    function startGame() {
        const el = getContainer()
        if (!el || el.offsetWidth === 0) {
            setTimeout(startGame, 50)
            return
        }

        boardRef.current = Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
        scoreRef.current = 0
        linesRef.current = 0
        levelRef.current = 1
        speedRef.current = INITIAL_SPEED
        stateRef.current = 'playing'

        if (!spawnPiece()) return

        onActivateRef.current()
        startLoop()
        flush()
    }

    function exitGame() {
        stopLoop()
        stateRef.current = 'idle'
        flush()
        onDeactivateRef.current()
    }

    // Watch isActive
    useEffect(() => {
        let last = isActive
        const poll = setInterval(() => {
            if (isActive === last) return
            last = isActive
            if (isActive && stateRef.current === 'idle') startGame()
            if (!isActive && stateRef.current !== 'idle') {
                stopLoop()
                stateRef.current = 'idle'
                flush()
            }
        }, 30)
        if (isActive && stateRef.current === 'idle') {
            requestAnimationFrame(startGame)
        }
        return () => clearInterval(poll)
    }, [])

    // Controls
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            if (stateRef.current !== 'playing') return
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault()
            }
            switch (e.key) {
                case 'ArrowLeft':  moveHorizontal(-1); break
                case 'ArrowRight': moveHorizontal(1);  break
                case 'ArrowDown':  moveDown();         break
                case 'ArrowUp':    rotatePiece();      break
                case ' ':          hardDrop();         break
            }
        }
        window.addEventListener('keydown', handle)
        return () => window.removeEventListener('keydown', handle)
    }, [])

    useEffect(() => () => stopLoop(), [])

    const { gs, score, lines, level } = rs
    const isPlaying = gs === 'playing'
    const isDead = gs === 'dead'
    const offset = getGridOffset()

    if (!isActive && !isDead) return null

    return (
        <>
            {/* Board cells */}
            {(isPlaying || isDead) && boardRef.current.map((row, y) =>
                row.map((cell, x) => {
                    if (!cell) return null
                    return (
                        <div
                            key={`${x}-${y}`}
                            className="absolute pointer-events-none"
                            style={{
                                left: offset.x + x * GRID,
                                top: offset.y + y * GRID,
                                width: GRID - 2,
                                height: GRID - 2,
                                backgroundColor: COLORS[cell],
                                border: '1px solid rgba(0,0,0,0.3)',
                                zIndex: 6,
                            }}
                        />
                    )
                })
            )}

            {/* Current piece */}
            {(isPlaying || isDead) && currentRef.current && currentRef.current.shape.map((p, i) => {
                const x = currentRef.current!.x + p.x
                const y = currentRef.current!.y + p.y
                if (y < 0) return null
                return (
                    <div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                            left: offset.x + x * GRID,
                            top: offset.y + y * GRID,
                            width: GRID - 2,
                            height: GRID - 2,
                            backgroundColor: COLORS[currentRef.current!.type],
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 0 10px rgba(0,255,200,0.4)',
                            zIndex: 7,
                        }}
                    />
                )
            })}

            {/* Score */}
            {isPlaying && (
                <div className="absolute top-24 right-6 z-20 font-mono text-xs pointer-events-none select-none space-y-1">
                    <div className="text-muted-foreground/50">SCORE <span className="text-accent font-bold">{score}</span></div>
                    <div className="text-muted-foreground/50">LINES <span className="text-accent font-bold">{lines}</span></div>
                    <div className="text-muted-foreground/50">LEVEL <span className="text-accent font-bold">{level}</span></div>
                </div>
            )}

            {/* Game over */}
            {isDead && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="font-mono text-sm tracking-widest text-red-400/80">GAME OVER</div>
                        <div className="font-mono text-xs text-muted-foreground/60">
                            Score: <span className="text-accent">{score}</span> · Lines: {lines}
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