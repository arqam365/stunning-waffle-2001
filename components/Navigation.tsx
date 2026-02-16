'use client'

import { Mail } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navigation() {
  const [activeSection, setActiveSection] = useState('systems')

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Update active section on scroll
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-amber/40">
              <img src="/bil.jpeg" alt="Bilal Sheikh" className="w-full h-full object-cover" />

            </div>
            <div className="hidden sm:block text-xs md:text-sm text-muted-foreground">
              Backend Engineer
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { id: 'systems', label: 'SYSTEMS' },
              { id: 'timeline', label: 'EXPERIENCE' },
              { id: 'contributions', label: 'CONTRIBUTIONS' },
              { id: 'contact', label: 'CONTACT' },
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

          {/* CTA Button */}
          <a
              href="mailto:mbilalsheikh2001@gmail.com"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-full hover:bg-accent/90 transition-all duration-300 text-sm font-medium glow-accent"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Say Hi</span>
          </a>
        </div>
      </nav>
  )
}