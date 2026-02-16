'use client'

import { useEffect, useState } from 'react'
import {GridCursorTrail} from "@/components/GridCursorTrail";

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

  useEffect(() => {
    // Initial animation
    codeSnippets.forEach((_, index) => {
      setTimeout(() => {
        setActiveSnippets(prev => new Set(prev).add(index))
      }, codeSnippets[index].delay)
    })

    // Continuous pulsing animation
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

  return (
      <section id="systems" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Grid background */}
        <div className="absolute inset-0 grid-background opacity-30" />
        <GridCursorTrail containerId="systems" />
        {/* Decorative background elements with code snippets */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient blurs */}
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

          {/* Code snippet grid - Top Right */}
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

          {/* Code snippet grid - Bottom Left */}
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

          {/* Code snippet grid - Bottom Right */}
          <div className="absolute bottom-24 md:bottom-32 right-4 md:right-8 space-y-2 text-right">
            <div className="text-xs md:text-sm font-mono text-accent/30 opacity-25 transition-all duration-500 hover:opacity-40">
              <span className="inline-block">scalable.architecture()</span>
            </div>
            <div className="text-xs md:text-sm font-mono text-accent/30 opacity-25 transition-all duration-500 hover:opacity-40">
              <span className="inline-block">modern.stack()</span>
            </div>
          </div>

          {/* Additional decorative code snippets - Center */}
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

        {/* Centered content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          <div className="animate-fade-in space-y-8">
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              I Build Systems
              <br />
              <span className="text-accent">That Scale.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Backend Engineer specializing in Python, APIs, and data-driven architecture.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-10">

              {/* OUTLINE BUTTON */}
              <button
                  onClick={() => scrollToSection('timeline')}
                  className="group relative overflow-hidden w-full sm:w-auto px-8 py-3 rounded-md border-2 border-accent font-semibold text-accent transition-all duration-300 ease-out
    hover:text-background hover:scale-105 active:scale-95"
              >
                {/* Animated background sweep */}
                <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

                {/* Glow layer */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-accent/30" />

                <span className="relative z-10 tracking-wide">
      PREVIOUS SYSTEM
    </span>
              </button>


              {/* PRIMARY BUTTON */}
              <button
                  onClick={() => scrollToSection('contributions')}
                  className="group relative overflow-hidden w-full sm:w-auto px-8 py-3 rounded-md font-semibold bg-accent text-background transition-all duration-300 ease-out
    hover:scale-105 active:scale-95"
              >
                {/* Pulse glow */}
                <span className="absolute inset-0 rounded-md bg-accent blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

                {/* Shine sweep effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <span className="relative z-10 tracking-wide">
      VIEW WORK
    </span>
              </button>

            </div>
          </div>
        </div>
      </section>
  )
}