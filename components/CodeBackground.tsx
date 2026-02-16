'use client'

export function CodeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Animated code lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-cyan text-sm font-mono">
          <div>{'{'} systems.init() {'}'}</div>
          <div className="mt-4">backend.deploy()</div>
          <div className="mt-4">performance.optimize()</div>
        </div>
        <div className="absolute bottom-20 right-10 text-cyan text-sm font-mono">
          <div>{'>'} architecture.build()</div>
          <div className="mt-4">{'>'} scale.infinite()</div>
        </div>
      </div>
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan rounded-full mix-blend-screen blur-3xl opacity-5" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan rounded-full mix-blend-screen blur-3xl opacity-5" />
    </div>
  )
}
