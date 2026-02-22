'use client'

import { useEffect, useRef, useState } from 'react'
import { GridCursorTrail } from "@/components/GridCursorTrail"
import { SnakeGameHero } from "@/components/ui/SnakeGameHero"
import { TetrisGameHero } from "@/components/ui/Tetrisgamehero"
import { PongGameHero } from "@/components/ui/Ponggamehero"
import { DinoGameHero } from "@/components/ui/Dinogamehero"
import { GameMenu } from "@/components/ui/GameMenu"

type GameMode = 'menu' | 'snake' | 'tetris' | 'pong' | 'dino' | null

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const codeSnippets = [
    { text: 'systems.init()', delay: 0 },
    { text: 'backend.deploy()', delay: 200 },
    { text: 'performance.optimize()', delay: 400 },
    { text: 'architecture.build()', delay: 600 },
    { text: 'scale.infinitely()', delay: 800 },
    { text: 'api.design()', delay: 1000 },
    { text: 'database.optimize()', delay: 1200 },
    { text: 'cloud.deploy()', delay: 1400 }
  ]

  const [activeSnippets, setActiveSnippets] = useState<Set<number>>(new Set())
  const [gameMode, setGameMode] = useState<GameMode>(null)

  const handleActivate   = useRef(() => {})
  const handleDeactivate = useRef(() => setGameMode(null))

  useEffect(() => {
    codeSnippets.forEach((_, index) => {
      setTimeout(() => {
        setActiveSnippets(prev => new Set(prev).add(index))
      }, codeSnippets[index].delay)
    })

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * codeSnippets.length)
      setActiveSnippets(prev => {
        const newSet = new Set(prev)
        if (newSet.has(randomIndex)) {
          newSet.delete(randomIndex)
        } else {
          newSet.add(randomIndex)
        }
        return newSet
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  // Spacebar opens menu, Escape closes everything
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Spacebar — open menu or close game
      if (e.key === ' ' || e.code === 'Space') {
        if (document.activeElement?.tagName === 'BUTTON') return
        e.preventDefault()
        setGameMode(prev => {
          if (prev === null) return 'menu'  // Open menu
          if (prev === 'menu') return null  // Close menu
          return null  // In game → exit to normal
        })
      }
      // Escape — always close
      if (e.key === 'Escape') {
        setGameMode(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Notify parent layout to hide nav/theme toggle during game
  useEffect(() => {
    const isGameActive = gameMode === 'snake' || gameMode === 'tetris' || gameMode === 'pong' || gameMode === 'dino'
    document.body.setAttribute('data-game-active', isGameActive.toString())
  }, [gameMode])

  const isGameActive = gameMode === 'snake' || gameMode === 'tetris' || gameMode === 'pong' || gameMode === 'dino'
  const contentOpacity = isGameActive ? 0.03 : gameMode === 'menu' ? 0.15 : 1

  return (
      <section id="systems" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Grid background */}
        <div className="absolute inset-0 grid-background opacity-30" />

        {/* Cursor trail — hidden during game, visible in menu */}
        {!isGameActive && <GridCursorTrail containerId="systems" opacity={gameMode === 'menu' ? 0.3 : 0.7} />}

        {/* Game Menu */}
        {gameMode === 'menu' && (
            <GameMenu
                onSelectGame={(game) => setGameMode(game)}
                onClose={() => setGameMode(null)}
            />
        )}

        {/* Snake game */}
        {gameMode === 'snake' && (
            <SnakeGameHero
                containerId="systems"
                isActive={true}
                onActivate={handleActivate.current}
                onDeactivate={handleDeactivate.current}
            />
        )}

        {/* Tetris game */}
        {gameMode === 'tetris' && (
            <TetrisGameHero
                containerId="systems"
                isActive={true}
                onActivate={handleActivate.current}
                onDeactivate={handleDeactivate.current}
            />
        )}

        {/* Pong game */}
        {gameMode === 'pong' && (
            <PongGameHero
                containerId="systems"
                isActive={true}
                onActivate={handleActivate.current}
                onDeactivate={handleDeactivate.current}
            />
        )}

        {/* Dino game */}
        {gameMode === 'dino' && (
            <DinoGameHero
                containerId="systems"
                isActive={true}
                onActivate={handleActivate.current}
                onDeactivate={handleDeactivate.current}
            />
        )}

        {/* Decorative background — dims based on mode */}
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500"
            style={{ opacity: contentOpacity }}
        >
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />

          {/* Code snippet grid - Top Left */}
          <div className="absolute top-20 md:top-24 left-4 md:left-8 space-y-2">
            {codeSnippets.slice(0, 3).map((snippet, i) => (
                <div
                    key={`tl-${i}`}
                    className={`text-xs md:text-sm font-mono transition-all duration-500 ${
                        activeSnippets.has(i)
                            ? 'code-snippet-active translate-x-0'
                            : 'code-snippet -translate-x-2'
                    }`}
                >
                  <span className="inline-block">{snippet.text}</span>
                </div>
            ))}
          </div>

          <div className="absolute top-24 md:top-28 right-4 md:right-12 space-y-2 text-right">
            {codeSnippets.slice(3, 6).map((snippet, i) => (
                <div
                    key={`tr-${i}`}
                    className={`text-xs md:text-sm font-mono transition-all duration-500 ${
                        activeSnippets.has(i)
                            ? 'code-snippet-active translate-x-0'
                            : 'code-snippet -translate-x-2'
                    }`}
                >
                  <span className="inline-block">{snippet.text}</span>
                </div>
            ))}
          </div>

          <div className="absolute bottom-20 md:bottom-24 left-4 md:left-12 space-y-2">
            {codeSnippets.slice(6, 8).map((snippet, i) => (
                <div
                    key={`bl-${i}`}
                    className={`text-xs md:text-sm font-mono transition-all duration-500 ${
                        activeSnippets.has(i)
                            ? 'code-snippet-active translate-x-0'
                            : 'code-snippet -translate-x-2'
                    }`}
                >
                  <span className="inline-block">{snippet.text}</span>
                </div>
            ))}
          </div>

          <div className="absolute bottom-24 md:bottom-32 right-4 md:right-8 space-y-2 text-right">
            <div className="text-xs md:text-sm font-mono text-accent/30 opacity-25 transition-all duration-500 hover:opacity-40">
              <span className="inline-block">scalable.architecture()</span>
            </div>
            <div className="text-xs md:text-sm font-mono text-accent/30 opacity-25 transition-all duration-500 hover:opacity-40">
              <span className="inline-block">modern.stack()</span>
            </div>
          </div>

          <div className="hidden xl:block absolute top-1/3 left-1/4 opacity-10">
            <div className="text-sm font-mono text-accent/50 animate-float">
              // Building scalable systems
            </div>
          </div>
          <div className="hidden xl:block absolute bottom-1/3 right-1/4 opacity-10">
            <div className="text-sm font-mono text-accent/50 animate-float-delayed">
              // Data-driven architecture
            </div>
          </div>
        </div>

        {/* Centered hero content */}
        <div
            className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center transition-all duration-500"
            style={{
              opacity: contentOpacity,
              pointerEvents: gameMode ? 'none' : 'auto',
            }}
        >
          <div className="animate-fade-in space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              I Build Systems
              <br />
              <span className="text-accent">That Scale.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Backend Engineer specializing in Python, APIs, and data-driven architecture.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-10">
              <button
                  onClick={() => scrollToSection('timeline')}
                  className="group relative overflow-hidden w-full sm:w-auto px-8 py-3 rounded-md border-2 border-accent font-semibold text-accent transition-all duration-300 ease-out
                hover:text-background hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-accent/30" />
                <span className="relative z-10 tracking-wide">PREVIOUS SYSTEM</span>
              </button>

              <button
                  onClick={() => scrollToSection('contributions')}
                  className="group relative overflow-hidden w-full sm:w-auto px-8 py-3 rounded-md font-semibold bg-accent text-background transition-all duration-300 ease-out
                hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 rounded-md bg-accent blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative z-10 tracking-wide">VIEW WORK</span>
              </button>
            </div>

            <div className="pt-4">
            <span className="font-mono text-xs text-muted-foreground/30 tracking-widest">
              press <span className="text-accent/50">[ space ]</span> to open arcade
            </span>
            </div>
          </div>
        </div>

        {/* Game mode hints */}
        {isGameActive && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
              <p className="font-mono text-xs text-muted-foreground/40 tracking-widest">
                <span className="text-accent/50">[ esc ]</span> exit · <span className="text-accent/50">[ space ]</span> pause
              </p>
            </div>
        )}
      </section>
  )
}