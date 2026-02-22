'use client'

import { useState } from 'react'
import { Gamepad2, Zap, Trophy, X } from 'lucide-react'

type GameOption = 'snake' | 'tetris' | 'pong' | 'dino'

interface GameMenuProps {
    onSelectGame: (game: GameOption) => void
    onClose: () => void
}

export function GameMenu({ onSelectGame, onClose }: GameMenuProps) {
    const [hovered, setHovered] = useState<GameOption | null>(null)

    const games = [
        {
            id: 'snake' as GameOption,
            name: 'Snake',
            description: 'Classic snake game. Eat, grow, don\'t crash.',
            icon: Gamepad2,
            color: 'from-green-400 to-emerald-600',
            difficulty: 'Easy',
        },
        {
            id: 'tetris' as GameOption,
            name: 'Tetris',
            description: 'Stack blocks, clear lines, survive.',
            icon: Zap,
            color: 'from-blue-400 to-cyan-600',
            difficulty: 'Medium',
        },
        {
            id: 'pong' as GameOption,
            name: 'Pong',
            description: 'Classic arcade. Beat the AI.',
            icon: Trophy,
            color: 'from-purple-400 to-pink-600',
            difficulty: 'Hard',
        },
        {
            id: 'dino' as GameOption,
            name: 'Dino Run',
            description: 'Jump over obstacles. Don\'t stop.',
            icon: Gamepad2,
            color: 'from-orange-400 to-red-600',
            difficulty: 'Medium',
        },
    ]

    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Menu container */}
            <div className="relative z-40 w-full max-w-2xl mx-6 animate-scale-in">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-background/10 border border-accent/20
            flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40
            transition-all duration-200 group"
                >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                        <p className="font-mono text-xs text-accent/60 tracking-widest">~/arcade</p>
                        <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                        Select Game
                    </h2>
                    <p className="text-sm text-muted-foreground font-mono">
                        Choose your challenge · Press ESC to cancel
                    </p>
                </div>

                {/* Game grid - 2x2 for 4 games */}
                <div className="grid grid-cols-2 gap-4">
                    {games.map((game) => {
                        const Icon = game.icon
                        const isHovered = hovered === game.id

                        return (
                            <button
                                key={game.id}
                                onClick={() => onSelectGame(game.id)}
                                onMouseEnter={() => setHovered(game.id)}
                                onMouseLeave={() => setHovered(null)}
                                className={`group relative p-6 rounded-lg border transition-all duration-300
                  bg-background/10 border-accent/20 hover:border-accent/60 hover:bg-background/20 cursor-pointer
                  ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100'}
                `}
                            >
                                {/* Glow effect on hover */}
                                {isHovered && (
                                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${game.color} opacity-10 blur-xl`} />
                                )}

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center text-center space-y-3">

                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                    bg-gradient-to-br ${game.color} ${isHovered ? 'scale-110 shadow-lg' : 'scale-100'}
                    `}
                                    >
                                        <Icon className="w-7 h-7 text-background" />
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-foreground">
                                            {game.name}
                                        </h3>
                                        <p className="text-xs font-mono text-muted-foreground">
                                            {game.description}
                                        </p>
                                    </div>

                                    {/* Difficulty badge */}
                                    <div className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider
                    bg-accent/10 text-accent border border-accent/20
                    ">
                                        {game.difficulty.toUpperCase()}
                                    </div>
                                </div>

                                {/* Hover border glow */}
                                {isHovered && (
                                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${game.color} opacity-20 animate-pulse`} />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Footer hint */}
                <p className="mt-6 text-center text-xs font-mono text-muted-foreground/40 tracking-wider">
                    Arrow keys to move · Space to pause · ESC to quit
                </p>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-accent/20 pointer-events-none" />
            <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-accent/20 pointer-events-none" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-accent/20 pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-accent/20 pointer-events-none" />
        </div>
    )
}