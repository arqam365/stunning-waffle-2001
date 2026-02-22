'use client'

import { useEffect, useRef, useState } from 'react'

type GameState = 'idle' | 'playing' | 'dead'
type Obstacle = {
    x: number
    y: number
    width: number
    height: number
    type: 'cactus' | 'bird'
}

const GRID = 40
const DINO_WIDTH = 2
const DINO_HEIGHT = 3
const GROUND_Y = 15
const GRAVITY = 0.8
const JUMP_STRENGTH = -14
const BASE_SPEED = 0.12
const MAX_SPEED = 0.35
const SPEED_INCREMENT = 0.0001
const BIRD_SPAWN_SCORE = 500 // Birds appear after score 500

interface DinoGameHeroProps {
    containerId: string
    isActive: boolean
    onActivate: () => void
    onDeactivate: () => void
}

export function DinoGameHero({ containerId, isActive, onActivate, onDeactivate }: DinoGameHeroProps) {
    const onActivateRef = useRef(onActivate)
    const onDeactivateRef = useRef(onDeactivate)
    onActivateRef.current = onActivate
    onDeactivateRef.current = onDeactivate

    const stateRef = useRef<GameState>('idle')
    const dinoRef = useRef({ x: 5, y: GROUND_Y, vy: 0, isJumping: false, isDucking: false })
    const obstaclesRef = useRef<Obstacle[]>([])
    const scoreRef = useRef(0)
    const highScoreRef = useRef(0)
    const speedRef = useRef(BASE_SPEED)
    const animFrameRef = useRef<number>(0)
    const lastTimeRef = useRef<number>(0)
    const colsRef = useRef(0)

    const [rs, setRs] = useState<{ gs: GameState; score: number; high: number; speed: number }>({
        gs: 'idle',
        score: 0,
        high: 0,
        speed: BASE_SPEED,
    })

    const flush = () => setRs({
        gs: stateRef.current,
        score: scoreRef.current,
        high: highScoreRef.current,
        speed: speedRef.current
    })

    function getContainer() {
        return document.getElementById(containerId)
    }

    function spawnObstacle() {
        const displayScore = Math.floor(scoreRef.current / 10)

        // Birds only spawn after score 500
        const canSpawnBird = displayScore >= BIRD_SPAWN_SCORE
        const type = canSpawnBird && Math.random() > 0.65 ? 'bird' : 'cactus'

        if (type === 'bird') {
            // Birds fly at different heights
            const flyHeight = Math.floor(Math.random() * 3) + 3 // 3-5 units above ground
            obstaclesRef.current.push({
                x: colsRef.current,
                y: GROUND_Y - flyHeight,
                width: 2,
                height: 2,
                type: 'bird',
            })
        } else {
            // Cacti on ground with varying heights
            const height = Math.floor(Math.random() * 2) + 2 // 2-3 units tall
            obstaclesRef.current.push({
                x: colsRef.current,
                y: GROUND_Y - height,
                width: 1,
                height,
                type: 'cactus',
            })
        }
    }

    function checkCollision() {
        const dino = dinoRef.current
        const dinoLeft = dino.x
        const dinoRight = dino.x + DINO_WIDTH

        // Duck makes dino shorter
        const dinoHeight = dino.isDucking ? DINO_HEIGHT - 1 : DINO_HEIGHT
        const dinoTop = dino.y - dinoHeight
        const dinoBottom = dino.y

        return obstaclesRef.current.some(obs => {
            const obsLeft = obs.x
            const obsRight = obs.x + obs.width
            const obsTop = obs.y
            const obsBottom = obs.y + obs.height

            return (
                dinoRight > obsLeft + 0.3 &&  // Small mercy on left edge
                dinoLeft < obsRight - 0.3 &&  // Small mercy on right edge
                dinoBottom > obsTop &&
                dinoTop < obsBottom
            )
        })
    }

    function gameLoop(timestamp: number) {
        if (stateRef.current !== 'playing') return

        const elapsed = timestamp - lastTimeRef.current
        if (elapsed < 16) {
            animFrameRef.current = requestAnimationFrame(gameLoop)
            return
        }
        lastTimeRef.current = timestamp

        const dino = dinoRef.current

        // Gravity
        dino.vy += GRAVITY
        dino.y += dino.vy

        // Ground collision
        if (dino.y >= GROUND_Y) {
            dino.y = GROUND_Y
            dino.vy = 0
            dino.isJumping = false
        }

        // Progressive speed increase (caps at MAX_SPEED like Chrome)
        if (speedRef.current < MAX_SPEED) {
            speedRef.current += SPEED_INCREMENT
        }

        // Move obstacles
        obstaclesRef.current = obstaclesRef.current.filter(obs => {
            obs.x -= speedRef.current
            return obs.x + obs.width > 0
        })

        // Spawn new obstacles with dynamic spacing based on speed
        const minGap = 15
        const maxGap = 25
        const spawnGap = maxGap - (speedRef.current - BASE_SPEED) * 30
        const actualGap = Math.max(minGap, spawnGap)

        if (obstaclesRef.current.length === 0 ||
            obstaclesRef.current[obstaclesRef.current.length - 1].x < colsRef.current - actualGap) {
            spawnObstacle()
        }

        // Score increases with speed
        scoreRef.current += Math.ceil(speedRef.current * 10)
        if (scoreRef.current > highScoreRef.current) {
            highScoreRef.current = scoreRef.current
        }

        // Collision
        if (checkCollision()) {
            stateRef.current = 'dead'
            flush()
            return
        }

        flush()
        animFrameRef.current = requestAnimationFrame(gameLoop)
    }

    function jump() {
        if (stateRef.current !== 'playing') return
        const dino = dinoRef.current
        if (!dino.isJumping) {
            dino.vy = JUMP_STRENGTH
            dino.isJumping = true
            dino.isDucking = false
        }
    }

    function duck(shouldDuck: boolean) {
        if (stateRef.current !== 'playing') return
        const dino = dinoRef.current
        if (!dino.isJumping) {
            dino.isDucking = shouldDuck
        }
    }

    function startGame() {
        const el = getContainer()
        if (!el || el.offsetWidth === 0) {
            setTimeout(startGame, 50)
            return
        }

        colsRef.current = Math.floor(el.offsetWidth / GRID)
        dinoRef.current = { x: 5, y: GROUND_Y, vy: 0, isJumping: false, isDucking: false }
        obstaclesRef.current = []
        scoreRef.current = 0
        speedRef.current = BASE_SPEED
        stateRef.current = 'playing'

        onActivateRef.current()
        lastTimeRef.current = performance.now()
        animFrameRef.current = requestAnimationFrame(gameLoop)
        flush()
    }

    function exitGame() {
        cancelAnimationFrame(animFrameRef.current)
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

    // Controls
    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            if (stateRef.current !== 'playing') return
            if (['ArrowUp', ' ', 'ArrowDown'].includes(e.key)) {
                e.preventDefault()
            }
            if (e.key === 'ArrowUp' || e.key === ' ') jump()
            if (e.key === 'ArrowDown') duck(true)
        }

        const handleUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') duck(false)
        }

        window.addEventListener('keydown', handleDown)
        window.addEventListener('keyup', handleUp)
        return () => {
            window.removeEventListener('keydown', handleDown)
            window.removeEventListener('keyup', handleUp)
        }
    }, [])

    useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

    const { gs, score, high, speed } = rs
    const isPlaying = gs === 'playing'
    const isDead = gs === 'dead'
    const displayScore = Math.floor(score / 10)
    const displayHigh = Math.floor(high / 10)

    // Night mode every 700 points like Chrome
    const isNightMode = Math.floor(displayScore / 700) % 2 === 1

    if (!isActive && !isDead) return null

    const dino = dinoRef.current
    const dinoHeight = dino.isDucking ? DINO_HEIGHT - 1 : DINO_HEIGHT

    return (
        <>
            {/* Ground line */}
            {(isPlaying || isDead) && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        left: 0,
                        top: GROUND_Y * GRID,
                        width: '100%',
                        height: 2,
                        backgroundColor: isNightMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,255,200,0.3)',
                        zIndex: 5,
                    }}
                />
            )}

            {/* Dino */}
            {(isPlaying || isDead) && (
                <div
                    className="absolute pointer-events-none transition-all duration-75"
                    style={{
                        left: dino.x * GRID,
                        top: (dino.y - dinoHeight) * GRID,
                        width: DINO_WIDTH * GRID,
                        height: dinoHeight * GRID,
                        backgroundColor: isNightMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,255,200,0.9)',
                        border: `2px solid ${isNightMode ? 'rgba(255,255,255,1)' : 'rgba(0,255,200,1)'}`,
                        boxShadow: `0 0 15px ${isNightMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,255,200,0.5)'}`,
                        zIndex: 7,
                    }}
                />
            )}

            {/* Obstacles */}
            {(isPlaying || isDead) && obstaclesRef.current.map((obs, i) => (
                <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        left: obs.x * GRID,
                        top: obs.y * GRID,
                        width: obs.width * GRID,
                        height: obs.height * GRID,
                        backgroundColor: isNightMode
                            ? (obs.type === 'bird' ? 'rgba(255,200,200,0.8)' : 'rgba(255,255,255,0.8)')
                            : (obs.type === 'bird' ? 'rgba(255,100,100,0.8)' : 'rgba(255,200,0,0.8)'),
                        border: `2px solid ${
                            isNightMode
                                ? (obs.type === 'bird' ? 'rgba(255,200,200,1)' : 'rgba(255,255,255,1)')
                                : (obs.type === 'bird' ? 'rgba(255,100,100,1)' : 'rgba(255,200,0,1)')
                        }`,
                        boxShadow: obs.type === 'bird' ? '0 0 10px rgba(255,100,100,0.4)' : '0 0 10px rgba(255,200,0,0.4)',
                        zIndex: 6,
                    }}
                />
            ))}

            {/* Score */}
            {isPlaying && (
                <div className="absolute top-24 right-6 z-20 font-mono text-xs pointer-events-none select-none space-y-1">
                    <div className={isNightMode ? 'text-white/70' : 'text-muted-foreground/50'}>
                        SCORE <span className={`font-bold ${isNightMode ? 'text-white' : 'text-accent'}`}>{displayScore}</span>
                    </div>
                    <div className={isNightMode ? 'text-white/40' : 'text-muted-foreground/30'}>
                        BEST <span className={`font-bold ${isNightMode ? 'text-white/60' : 'text-accent/50'}`}>{displayHigh}</span>
                    </div>
                </div>
            )}

            {/* Game over */}
            {isDead && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="font-mono text-sm tracking-widest text-red-400/80">GAME OVER</div>
                        <div className="font-mono text-xs text-muted-foreground/60">
                            Score: <span className="text-accent">{displayScore}</span>
                            {score >= high && score > 0 && <span className="ml-2 text-accent/60">🏆 new best</span>}
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