'use client'

import { AnimatedCounter } from '@/components/AnimatedCounter'

export function MetricsSection() {
  return (
    <section className="relative py-16 md:py-24 border-y border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="text-center p-6 rounded-lg bg-muted/30">
            <AnimatedCounter end={50} label="APIs Built" suffix="+" />
          </div>
          <div className="text-center p-6 rounded-lg bg-muted/30">
            <AnimatedCounter end={30} label="Projects" suffix="+" />
          </div>
          <div className="text-center p-6 rounded-lg bg-muted/30">
            <AnimatedCounter end={40} label="Performance Gain" suffix="%" />
          </div>
          <div className="text-center p-6 rounded-lg bg-muted/30 col-span-2 md:col-span-1">
            <AnimatedCounter end={100} label="Lines of Code" suffix="K+" />
          </div>
        </div>
      </div>
    </section>
  )
}
