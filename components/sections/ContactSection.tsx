'use client'

import { Mail, Github, Linkedin } from 'lucide-react'

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        <div className="animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-balance">
            Let's make something
            <br />
            <span className="text-accent">amazing toghether.</span>
          </h2>
          
          <p className="text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            Start by <span className="text-accent font-semibold">saying hi</span>
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            <a
              href="mailto:mbilalsheikh2001@gmail.com"
              className="group flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:border-accent transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">Email</div>
              <div className="text-xs text-muted-foreground">Say hello</div>
            </a>

            <a
              href="https://www.linkedin.com/in/mohammedbilalsheikh/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:border-accent transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Linkedin className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">LinkedIn</div>
              <div className="text-xs text-muted-foreground">Let's connect</div>
            </a>

            <a
              href="https://github.com/Bilal2001"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:border-accent transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Github className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">GitHub</div>
              <div className="text-xs text-muted-foreground">View code</div>
            </a>
          </div>
          
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 Mohammed Bilal Sheikh. All Rights Reserved
              </p>
              <p className="text-sm text-muted-foreground">
                Built with ❤️ by <a href="https://github.com/Bilal2001" target="_blank" rel="noopener noreferrer">Bilal Sheikh</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
