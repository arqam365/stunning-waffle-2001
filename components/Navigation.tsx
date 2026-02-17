'use client'

import { Mail } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const PHRASES = [
  { text: 'Backend Engineer',      prefix: '~/role' },
  { text: 'Mohammad Bilal Sheikh', prefix: '~/whoami' },
  { text: 'Python Developer',      prefix: '~/stack' },
  { text: 'Systems Architect',     prefix: '~/title' },
]

const TYPE_SPEED   = 55
const DELETE_SPEED = 30
const PAUSE_AFTER  = 2200
const PAUSE_BEFORE = 400

function useTypewriter() {
  const [displayed, setDisplayed] = useState('')
  const [prefix, setPrefix]       = useState(PHRASES[0].prefix)
  const [isTyping, setIsTyping]   = useState(true)
  const [glowing, setGlowing]     = useState(false)
  const [jiggle, setJiggle]       = useState(false)
  const phraseIdx = useRef(0)
  const charIdx   = useRef(0)
  const phase     = useRef<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing')
  const timer     = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function tick() {
      const phrase = PHRASES[phraseIdx.current]

      if (phase.current === 'typing') {
        charIdx.current++
        setDisplayed(phrase.text.slice(0, charIdx.current))
        setIsTyping(true)
        if (charIdx.current >= phrase.text.length) {
          setGlowing(true)
          setJiggle(true)
          setTimeout(() => setJiggle(false), 600)
          phase.current = 'pausing'
          timer.current = setTimeout(tick, PAUSE_AFTER)
        } else {
          timer.current = setTimeout(tick, TYPE_SPEED)
        }
      } else if (phase.current === 'pausing') {
        setGlowing(false)
        setIsTyping(false)
        phase.current = 'deleting'
        timer.current = setTimeout(tick, DELETE_SPEED)
      } else if (phase.current === 'deleting') {
        charIdx.current--
        setDisplayed(phrase.text.slice(0, charIdx.current))
        if (charIdx.current <= 0) {
          phraseIdx.current = (phraseIdx.current + 1) % PHRASES.length
          setPrefix(PHRASES[phraseIdx.current].prefix)
          phase.current = 'waiting'
          timer.current = setTimeout(tick, PAUSE_BEFORE)
        } else {
          timer.current = setTimeout(tick, DELETE_SPEED)
        }
      } else if (phase.current === 'waiting') {
        charIdx.current = 0
        phase.current = 'typing'
        timer.current = setTimeout(tick, TYPE_SPEED)
      }
    }

    timer.current = setTimeout(tick, 800)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [])

  return { displayed, prefix, isTyping, glowing, jiggle }
}

function AvatarTooltip({ children }: { children: React.ReactNode }) {
  const [show, setShow]   = useState(false)
  const [typed, setTyped] = useState('')
  const greeting = '> Hello, visitor! 👋'
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const charRef  = useRef(0)

  function startTyping() {
    setShow(true)
    setTyped('')
    charRef.current = 0
    function step() {
      charRef.current++
      setTyped(greeting.slice(0, charRef.current))
      if (charRef.current < greeting.length) {
        timerRef.current = setTimeout(step, 40)
      }
    }
    timerRef.current = setTimeout(step, 100)
  }

  function stopTyping() {
    setShow(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    charRef.current = 0
    setTyped('')
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
      <div
          className="relative flex items-center gap-2"
          onMouseEnter={startTyping}
          onMouseLeave={stopTyping}
      >
        {children}

        {show && (
            <div
                className="absolute left-0 top-full mt-2 z-[200] pointer-events-none"
                style={{ minWidth: '220px' }}
            >
              <div
                  className="rounded-md border border-accent/30 bg-background/95 backdrop-blur-md shadow-xl overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5), 0 0 1px rgba(0,255,200,0.2)' }}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/30 border-b border-border/30">
                  <div className="w-2 h-2 rounded-full bg-red-500/70" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                  <div className="w-2 h-2 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-[10px] font-mono text-muted-foreground/50 tracking-wider">
                terminal
              </span>
                </div>
                <div className="px-3 py-2 font-mono text-xs">
                  <span className="text-accent/80">{typed}</span>
                  <span
                      className="inline-block w-[7px] h-[12px] bg-accent/80 ml-0.5 align-middle"
                      style={{ animation: 'blink 1s step-end infinite' }}
                  />
                </div>
              </div>
              <div className="absolute -top-[5px] left-4 w-2.5 h-2.5 rotate-45 border-l border-t border-accent/30 bg-background/95" />
            </div>
        )}
      </div>
  )
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState('systems')
  const { displayed, prefix, isTyping, glowing, jiggle } = useTypewriter()

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['systems', 'timeline', 'contributions', 'contact']
      const scrollPosition = window.scrollY + 100
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
      <>
        <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes termGlow {
          0%, 100% { text-shadow: 0 0 8px rgba(0,255,200,0.9), 0 0 20px rgba(0,255,200,0.4); }
          50%       { text-shadow: 0 0 14px rgba(0,255,200,1), 0 0 35px rgba(0,255,200,0.6); }
        }
        @keyframes jiggle {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-3px) rotate(-1deg); }
          30%  { transform: translateX(3px) rotate(1deg); }
          45%  { transform: translateX(-2px) rotate(-0.5deg); }
          60%  { transform: translateX(2px) rotate(0.5deg); }
          75%  { transform: translateX(-1px); }
          100% { transform: translateX(0); }
        }
      `}</style>

        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
          {/*
          Three-column grid:
          col 1 (left)   = logo + terminal text  — fixed, never shifts
          col 2 (center) = nav links             — always perfectly centered
          col 3 (right)  = CTA button            — always right-aligned
        */}
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

            {/* ── Col 1: Logo + Terminal text ── */}
            <AvatarTooltip>
              <div
                  className="w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105"
                  style={{ boxShadow: '0 0 0 2px rgba(0,255,200,0.3)' }}
              >
                <img src="/bil.jpeg" alt="Bilal Sheikh" className="w-full h-full object-cover" />
              </div>

              {/*
              Fixed width — longest phrase is "Mohammad Bilal Sheikh" (~185px at text-sm).
              This box never grows or shrinks, so col 1 width stays constant.
            */}
              <div
                  className="hidden sm:flex flex-col justify-center cursor-default select-none overflow-hidden"
                  style={{ width: '185px' }}
              >
                <div className="text-[10px] font-mono text-accent/40 tracking-wider leading-none mb-0.5">
                  {prefix}
                </div>
                <div
                    className="font-mono text-sm font-medium leading-none flex items-center"
                    style={{
                      color: glowing ? 'rgba(0,255,200,1)' : undefined,
                      animation: jiggle
                          ? 'jiggle 0.5s ease-in-out, termGlow 1s ease-in-out infinite'
                          : glowing
                              ? 'termGlow 1.5s ease-in-out infinite'
                              : 'none',
                      transition: 'color 0.3s ease',
                    }}
                >
                  <span>{displayed}</span>
                  <span
                      className="inline-block w-[2px] h-[13px] bg-current ml-[2px] align-middle flex-shrink-0"
                      style={{
                        animation: 'blink 1s step-end infinite',
                        opacity: isTyping ? 1 : 0.5,
                      }}
                  />
                </div>
              </div>
            </AvatarTooltip>

            {/* ── Col 2: Nav links — centered in their own column ── */}
            <div className="hidden md:flex items-center justify-center gap-1">
              {[
                { id: 'systems',       label: 'SYSTEMS' },
                { id: 'timeline',      label: 'EXPERIENCE' },
                { id: 'contributions', label: 'CONTRIBUTIONS' },
                { id: 'contact',       label: 'CONTACT' },
              ].map((item) => (
                  <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                          activeSection === item.id
                              ? 'bg-accent text-background'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    {item.label}
                  </button>
              ))}
            </div>

            {/* ── Col 3: CTA — right-aligned ── */}
            <div className="flex justify-end">
              <a
                  href="mailto:mbilalsheikh2001@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-full hover:bg-accent/90 transition-all duration-300 text-sm font-medium glow-accent"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Say Hi</span>
              </a>
            </div>

          </div>
        </nav>
      </>
  )
}