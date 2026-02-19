'use client'

import { Mail, Github, Linkedin, MapPin, Send, ArrowRight, AlertCircle } from 'lucide-react'
import { useState, useRef } from 'react'
import { sendContactEmail } from '@/app/actions/send-contact-email'

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const startTime = useRef<number>(Date.now())

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null) // Clear errors on typing
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields')
      return
    }

    setStatus('sending')
    setError(null)

    const elapsed = Date.now() - startTime.current
    const result = await sendContactEmail(form, { timing: elapsed })

    if (result.success) {
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => {
        setStatus('idle')
        startTime.current = Date.now() // Reset for next submission
      }, 5000)
    } else {
      setStatus('error')
      setError(result.error || 'Failed to send message')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputBase =
      'w-full bg-transparent border-b text-sm font-mono py-3 pr-3 outline-none transition-all duration-300 placeholder:text-muted-foreground/30 text-foreground'
  const inputIdle   = 'border-border/40'
  const inputFocus  = 'border-accent'
  const inputError  = 'border-red-400/50'

  return (
      <section id="contact" className="relative min-h-screen flex flex-col justify-between overflow-hidden">

        {/* Ambient glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

        {/* ── Main content ── */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pt-24 md:pt-32 pb-16">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* ── LEFT — Big heading + form ── */}
            <div className="space-y-12">
              {/* Heading */}
              <div>
                <p className="font-mono text-xs text-accent/60 tracking-widest mb-4">~/contact</p>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                  Get in
                  <br />
                  <span className="text-accent">touch.</span>
                </h2>
                <p className="mt-6 text-muted-foreground text-base max-w-sm leading-relaxed">
                  Have a project in mind or just want to chat about backend systems?
                  Drop a message — I read every one.
                </p>
              </div>

              {/* Contact form */}
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Name */}
                <div className="relative">
                  <label className="block font-mono text-[10px] tracking-widest text-muted-foreground/50 mb-1">
                    NAME
                  </label>
                  <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      placeholder="Your name"
                      className={`${inputBase} ${error ? inputError : focused === 'name' ? inputFocus : inputIdle}`}
                      disabled={status === 'sending' || status === 'sent'}
                  />
                  <span
                      className={`absolute bottom-0 left-0 h-[1px] transition-all duration-500 ${error ? 'bg-red-400' : 'bg-accent'}`}
                      style={{ width: focused === 'name' ? '100%' : '0%' }}
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="block font-mono text-[10px] tracking-widest text-muted-foreground/50 mb-1">
                    EMAIL
                  </label>
                  <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      placeholder="your@email.com"
                      className={`${inputBase} ${error ? inputError : focused === 'email' ? inputFocus : inputIdle}`}
                      disabled={status === 'sending' || status === 'sent'}
                  />
                  <span
                      className={`absolute bottom-0 left-0 h-[1px] transition-all duration-500 ${error ? 'bg-red-400' : 'bg-accent'}`}
                      style={{ width: focused === 'email' ? '100%' : '0%' }}
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <label className="block font-mono text-[10px] tracking-widest text-muted-foreground/50 mb-1">
                    MESSAGE
                  </label>
                  <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      placeholder="Tell me about your project..."
                      rows={4}
                      className={`${inputBase} resize-none ${error ? inputError : focused === 'message' ? inputFocus : inputIdle}`}
                      disabled={status === 'sending' || status === 'sent'}
                  />
                  <span
                      className={`absolute bottom-0 left-0 h-[1px] transition-all duration-500 ${error ? 'bg-red-400' : 'bg-accent'}`}
                      style={{ width: focused === 'message' ? '100%' : '0%' }}
                  />
                </div>

                {/* Error message */}
                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-sm animate-fade-in">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="font-mono text-xs text-red-400 tracking-wide">{error}</p>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={status === 'sending' || status === 'sent'}
                    className="group relative flex items-center gap-3 px-8 py-3 border border-accent/40 rounded-sm
                  font-mono text-sm text-accent tracking-widest overflow-hidden
                  hover:border-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 bg-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                  {status === 'sending' ? 'SENDING...' : status === 'sent' ? 'MESSAGE SENT ✓' : status === 'error' ? 'TRY AGAIN' : 'SEND MESSAGE'}
                </span>
                  {status === 'idle' && (
                      <Send className="relative z-10 w-3.5 h-3.5 group-hover:text-background transition-colors duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                  {status === 'sent' && (
                      <span className="relative z-10 text-accent text-base">🎉</span>
                  )}
                </button>

                {/* Sent confirmation */}
                {status === 'sent' && (
                    <div className="space-y-2 animate-fade-in">
                      <p className="font-mono text-xs text-accent/80 tracking-wider">
                        &gt; Message sent successfully!
                      </p>
                      <p className="font-mono text-xs text-muted-foreground/60 tracking-wide">
                        Check your email for a confirmation. I'll get back to you soon.
                      </p>
                    </div>
                )}
              </form>
            </div>

            {/* ── RIGHT — Contact details ── */}
            <div className="space-y-10 md:pt-24">
              <div>
                <p className="font-mono text-xs text-muted-foreground/40 tracking-widest mb-3">~/start</p>
                <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                  Start a<br />conversation.
                </h3>
              </div>

              <div className="space-y-8">
                <a
                    href="mailto:mbilalsheikh2001@gmail.com"
                    className="group flex items-start gap-5 py-4 border-b border-border/20 hover:border-accent/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-sm border border-border/40 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-300">
                    <Mail className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground/40 mb-1">MAIL</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                      mbilalsheikh2001@gmail.com
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/20 ml-auto self-center group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                </a>

                <a
                    href="https://www.linkedin.com/in/mohammedbilalsheikh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5 py-4 border-b border-border/20 hover:border-accent/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-sm border border-border/40 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-300">
                    <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground/40 mb-1">LINKEDIN</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                      mohammedbilalsheikh
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/20 ml-auto self-center group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                </a>

                <a
                    href="https://github.com/Bilal2001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5 py-4 border-b border-border/20 hover:border-accent/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-sm border border-border/40 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-300">
                    <Github className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground/40 mb-1">GITHUB</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                      Bilal2001
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/20 ml-auto self-center group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                </a>

                <div className="group flex items-start gap-5 py-4 border-b border-border/20">
                  <div className="w-10 h-10 rounded-sm border border-border/40 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground/40 mb-1">LOCATION</p>
                    <p className="text-sm font-medium text-foreground">Available Worldwide</p>
                    <p className="text-xs text-muted-foreground/50 mt-0.5">Remote · Open to relocation</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground/50 tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
                Available for new projects
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-border/20 max-w-7xl mx-auto w-full px-6 md:px-12 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground/40 tracking-wider">
              © 2026 Mohammed Bilal Sheikh. All Rights Reserved
            </p>
            <p className="font-mono text-xs text-muted-foreground/40 tracking-wider">
              Built with <span className="text-red-400">❤</span> by{' '}
              <a
                  href="https://github.com/Bilal2001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent/60 hover:text-accent transition-colors duration-200"
              >
                Bilal Sheikh
              </a>
            </p>
          </div>
        </div>

      </section>
  )
}