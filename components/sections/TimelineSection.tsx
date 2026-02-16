'use client'

export function TimelineSection() {
  const experiences = [
    {
      company: 'Variance Technology Pvt Ltd',
      role: 'Python Backend Engineer',
      period: '2022 - Present',
      descriptions: [
        'Architected and deployed scalable microservices handling 2M+ daily events',
        'Optimized database queries reducing average response time by 45%',
        'Led integration of payment processing system handling $10M+ transactions',
        'Mentored junior developers on system design and best practices',
      ],
    },
    {
      company: 'Jobauto.ai',
      role: 'Senior Backend Developer',
      period: '2021 - 2022',
      descriptions: [
        'Built real-time job matching engine using ML algorithms',
        'Designed and implemented distributed task queue system',
        'Improved API response times by 60% through caching strategies',
        'Implemented comprehensive logging and monitoring infrastructure',
      ],
    },
  ]

  return (
    <section id="timeline" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">My Work Experience</h2>
        </div>
        
        <div className="relative space-y-0">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative grid grid-cols-[auto_1fr] gap-6 pb-12 last:pb-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Timeline column with line and dot */}
              <div className="relative flex flex-col items-center">
                {/* Timeline dot with glow */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent rounded-full shadow-lg glow-accent">
                  <div className="w-6 h-6 bg-accent-foreground rounded-full" />
                </div>
                
                {/* Vertical line connecting to next item */}
                {index < experiences.length - 1 && (
                  <div className="absolute top-12 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent" />
                )}
              </div>
              
              {/* Content column */}
              <div className="pt-0">
                <div className="bg-card border-2 border-border rounded-lg p-6 hover:border-accent transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-foreground">{exp.role}</h3>
                      <p className="text-accent font-semibold text-base">{exp.company}</p>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      {exp.period}
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {exp.descriptions.map((desc, i) => (
                      <li key={i} className="text-muted-foreground text-sm leading-relaxed flex items-start">
                        <span className="text-accent mr-3 mt-0.5 font-bold text-base">→</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
