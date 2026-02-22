'use client'

import { useEffect, useRef, useState } from 'react'

type GameState = 'idle' | 'playing' | 'dead'

const GRID = 40
const PADDLE_HEIGHT = 5
const PADDLE_WIDTH = 1
const BALL_SIZE = 1
const AI_SPEED = 0.08
const PLAYER_SPEED = 0.12

interface PongGameHeroProps {
    containerId: string
    isActive: boolean
    onActivate: () => void
    onDeactivate: () => void
}

export function PongGameHero({ containerId, isActive, onActivate, onDeactivate }: PongGameHeroProps) {
    const onActivateRef = useRef(onActivate)
    const onDeactivateRef = useRef(onDeactivate)
    onActivateRef.current = onActivate
    onDeactivateRef.current = onDeactivate

    const stateRef = useRef<GameState>('idle')
    const playerYRef = useRef(0)
    const aiYRef = useRef(0)
    const ballRef = useRef({ x: 0, y: 0, dx: 0, dy: 0 })
    const scoreRef = useRef({ player: 0, ai: 0 })
    const animFrameRef = useRef<number>(0)
    const colsRef = useRef(0)
    const rowsRef = useRef(0)
    const keysRef = useRef<{ [key: string]: boolean }>({})

    const [rs, setRs] = useState<{ gs: GameState; playerScore: number; aiScore: number }>({
        gs: 'idle',
        playerScore: 0,
        aiScore: 0,
    })

    const flush = () => setRs({ gs: stateRef.current, playerScore: scoreRef.current.player, aiScore: scoreRef.current.ai })

    function getContainer() {
        return document.getElementById(containerId)
    }

    function resetBall() {
        const { cols, rows } = { cols: colsRef.current, rows: rowsRef.current }
        ballRef.current = {
            x: cols / 2,
            y: rows / 2,
            dx: (Math.random() > 0.5 ? 1 : -1) * 0.18,
            dy: (Math.random() - 0.5) * 0.12,
        }
    }

    function gameLoop() {
        if (stateRef.current !== 'playing') return

        const { cols, rows } = { cols: colsRef.current, rows: rowsRef.current }
        const ball = ballRef.current

        // Player movement (smooth continuous)
        if (keysRef.current['ArrowUp']) {
            playerYRef.current = Math.max(0, playerYRef.current - PLAYER_SPEED)
        }
        if (keysRef.current['ArrowDown']) {
            playerYRef.current = Math.min(rows - PADDLE_HEIGHT, playerYRef.current + PLAYER_SPEED)
        }

        // Move ball
        ball.x += ball.dx
        ball.y += ball.dy

        // Ball top/bottom bounce
        if (ball.y <= 0 || ball.y >= rows - BALL_SIZE) {
            ball.dy = -ball.dy
        }

        // Ball vs player paddle (left side)
        if (ball.dx < 0 && ball.x <= PADDLE_WIDTH) {
            if (ball.y + BALL_SIZE >= playerYRef.current && ball.y <= playerYRef.current + PADDLE_HEIGHT) {
                ball.dx = Math.abs(ball.dx) * 1.08
                const hitPos = (ball.y - playerYRef.current) / PADDLE_HEIGHT
                ball.dy = (hitPos - 0.5) * 0.3
                ball.x = PADDLE_WIDTH + 0.1
            }
        }

        // Ball vs AI paddle (right side)
        if (ball.dx > 0 && ball.x + BALL_SIZE >= cols - PADDLE_WIDTH) {
            if (ball.y + BALL_SIZE >= aiYRef.current && ball.y <= aiYRef.current + PADDLE_HEIGHT) {
                ball.dx = -Math.abs(ball.dx) * 1.08
                const hitPos = (ball.y - aiYRef.current) / PADDLE_HEIGHT
                ball.dy = (hitPos - 0.5) * 0.3
                ball.x = cols - PADDLE_WIDTH - BALL_SIZE - 0.1
            }
        }

        // Score - player misses
        if (ball.x < -1) {
            scoreRef.current.ai++
            if (scoreRef.current.ai >= 5) {
                stateRef.current = 'dead'
                flush()
                return
            }
            resetBall()
            flush()
        }

        // Score - AI misses
        if (ball.x > cols + 1) {
            scoreRef.current.player++
            if (scoreRef.current.player >= 5) {
                stateRef.current = 'dead'
                flush()
                return
            }
            resetBall()
            flush()
        }

        // AI movement (predictive)
        const predictedBallY = ball.y + (ball.dy * 10)
        const aiCenter = aiYRef.current + PADDLE_HEIGHT / 2
        const targetY = Math.max(PADDLE_HEIGHT / 2, Math.min(rows - PADDLE_HEIGHT / 2, predictedBallY))

        if (targetY < aiCenter - 0.3) {
            aiYRef.current = Math.max(0, aiYRef.current - AI_SPEED)
        } else if (targetY > aiCenter + 0.3) {
            aiYRef.current = Math.min(rows - PADDLE_HEIGHT, aiYRef.current + AI_SPEED)
        }

        flush()
        animFrameRef.current = requestAnimationFrame(gameLoop)
    }

    function startGame() {
        const el = getContainer()
        if (!el || el.offsetWidth === 0) {
            setTimeout(startGame, 50)
            return
        }

        colsRef.current = Math.floor(el.offsetWidth / GRID)
        rowsRef.current = Math.floor(el.offsetHeight / GRID)

        playerYRef.current = rowsRef.current / 2 - PADDLE_HEIGHT / 2
        aiYRef.current = rowsRef.current / 2 - PADDLE_HEIGHT / 2
        scoreRef.current = { player: 0, ai: 0 }
        stateRef.current = 'playing'
        keysRef.current = {}

        resetBall()
        onActivateRef.current()
        animFrameRef.current = requestAnimationFrame(gameLoop)
        flush()
    }

    function exitGame() {
        cancelAnimationFrame(animFrameRef.current)
        stateRef.current = 'idle'
        keysRef.current = {}
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
                cancelAnimationFrame(animFrameRef.current)
                stateRef.current = 'idle'
                flush()
            }
        }, 30)
        if (isActive && stateRef.current === 'idle') {
            requestAnimationFrame(startGame)
        }
        return () => clearInterval(poll)
    }, [])

    // Controls - track key state
    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            if (stateRef.current !== 'playing') return
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault()
                keysRef.current[e.key] = true
            }
        }

        const handleUp = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                keysRef.current[e.key] = false
            }
        }

        window.addEventListener('keydown', handleDown)
        window.addEventListener('keyup', handleUp)
        return () => {
            window.removeEventListener('keydown', handleDown)
            window.removeEventListener('keyup', handleUp)
        }
    }, [])

    useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

    const { gs, playerScore, aiScore } = rs
    const isPlaying = gs === 'playing'
    const isDead = gs === 'dead'

    if (!isActive && !isDead) return null

    return (
        <>
            {/* Center line */}
            {(isPlaying || isDead) && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        left: '50%',
                        top: 0,
                        width: 2,
                        height: '100%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 50%, transparent 50%)',
                        backgroundSize: '100% 40px',
                        zIndex: 5,
                    }}
                />
            )}

            {/* Player paddle */}
            {(isPlaying || isDead) && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        left: 0,
                        top: playerYRef.current * GRID,
                        width: PADDLE_WIDTH * GRID,
                        height: PADDLE_HEIGHT * GRID,
                        backgroundColor: 'rgba(0,255,200,0.9)',
                        boxShadow: '0 0 15px rgba(0,255,200,0.6)',
                        zIndex: 6,
                    }}
                />
            )}

            {/* AI paddle */}
            {(isPlaying || isDead) && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        right: 0,
                        top: aiYRef.current * GRID,
                        width: PADDLE_WIDTH * GRID,
                        height: PADDLE_HEIGHT * GRID,
                        backgroundColor: 'rgba(255,100,100,0.9)',
                        boxShadow: '0 0 15px rgba(255,100,100,0.6)',
                        zIndex: 6,
                    }}
                />
            )}

            {/* Ball */}
            {(isPlaying || isDead) && (
                <div
                    className="absolute pointer-events-none rounded-full"
                    style={{
                        left: ballRef.current.x * GRID,
                        top: ballRef.current.y * GRID,
                        width: BALL_SIZE * GRID,
                        height: BALL_SIZE * GRID,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        boxShadow: '0 0 20px rgba(255,255,255,0.8)',
                        zIndex: 7,
                    }}
                />
            )}

            {/* Score */}
            {isPlaying && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 font-mono text-2xl pointer-events-none select-none flex gap-8">
                    <div className="text-accent">{playerScore}</div>
                    <div className="text-muted-foreground/30">:</div>
                    <div className="text-red-400">{aiScore}</div>
                </div>
            )}

            {/* Game over */}
            {isDead && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="font-mono text-sm tracking-widest text-red-400/80">
                            {playerScore > aiScore ? 'YOU WIN!' : 'AI WINS!'}
                        </div>
                        <div className="font-mono text-lg text-muted-foreground/60">
                            <span className="text-accent">{playerScore}</span> - <span className="text-red-400">{aiScore}</span>
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