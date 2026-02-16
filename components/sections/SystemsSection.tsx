'use client'

export function SystemsSection() {
  const systems = [
    {
      title: 'E-commerce Analytics Platform',
      description: 'Real-time analytics dashboard with Python backend processing millions of events daily.',
      stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery'],
      results: 'Reduced query time by 60% | Processed 2M+ events/day',
      link: '#',
    },
    {
      title: 'Payment Processing System',
      description: 'Secure payment gateway integration with fraud detection and transaction logging.',
      stack: ['Python', 'Django', 'Stripe API', 'MongoDB', 'AWS'],
      results: '99.99% uptime | Handled $10M+ in transactions',
      link: '#',
    },
    {
      title: 'Machine Learning Pipeline',
      description: 'Automated data processing and model serving infrastructure for ML inference.',
      stack: ['Python', 'TensorFlow', 'Flask', 'Docker', 'Kubernetes'],
      results: 'Sub-100ms inference | Trained 50+ models',
      link: '#',
    },
  ]

  return (
    <section id="systems" className="relative py-24 md:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">My Latest Systems</h2>
          <p className="text-muted-foreground">Perfect solutions for scalable architectures</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {systems.map((system, index) => (
            <div
              key={index}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Color header */}
              <div className={`h-2 ${index === 0 ? 'bg-accent' : index === 1 ? 'bg-primary' : 'bg-accent/60'}`} />
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{system.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{system.description}</p>
                
                <div className="mb-6">
                  <p className="text-xs text-accent mb-3 uppercase tracking-wider font-semibold">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {system.stack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border mb-4">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Results</p>
                  <p className="text-sm font-semibold text-foreground">{system.results}</p>
                </div>
                
                <a
                  href={system.link}
                  className="inline-flex items-center text-sm font-medium text-accent hover:underline"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
