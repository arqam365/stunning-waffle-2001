'use client'

export function PhilosophySection() {
  const philosophies = [
    {
      title: 'Performance over noise.',
      description: 'Every millisecond matters. Systems should be fast, predictable, and efficient.',
    },
    {
      title: 'Architecture over hacks.',
      description: 'Build for the future. Solid design today prevents chaos tomorrow.',
    },
    {
      title: 'Impact over hype.',
      description: 'Measure what matters. Real metrics, real results, real engineering.',
    },
  ]

  return (
    <section className="relative py-24 md:py-32 bg-card">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">What do I help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I will help you with finding a solution and solve your problems. 
            We use process design to create scalable systems.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {philosophies.map((item, index) => (
            <div
              key={index}
              className="text-center p-8 bg-background rounded-lg border border-border hover:border-accent transition-all animate-slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
                index === 0 ? 'bg-primary/10 text-primary' : 
                index === 1 ? 'bg-accent/10 text-accent' : 
                'bg-accent/10 text-accent'
              }`}>
                <div className="text-2xl font-bold">{index + 1}</div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
