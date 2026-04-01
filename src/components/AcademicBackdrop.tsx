const particles = [
  { top: '12%', left: '8%', size: 2, delay: '0s', duration: '7s' },
  { top: '18%', left: '30%', size: 3, delay: '1.2s', duration: '8s' },
  { top: '24%', left: '72%', size: 2, delay: '0.6s', duration: '6.5s' },
  { top: '32%', left: '56%', size: 2, delay: '2.2s', duration: '9s' },
  { top: '38%', left: '12%', size: 3, delay: '1.8s', duration: '7.5s' },
  { top: '44%', left: '82%', size: 2, delay: '0.4s', duration: '6.8s' },
  { top: '52%', left: '22%', size: 2, delay: '2.8s', duration: '8.4s' },
  { top: '58%', left: '64%', size: 3, delay: '1.1s', duration: '7.2s' },
  { top: '66%', left: '10%', size: 2, delay: '0.9s', duration: '6.2s' },
  { top: '72%', left: '36%', size: 2, delay: '1.6s', duration: '8.8s' },
  { top: '78%', left: '78%', size: 3, delay: '2.4s', duration: '7.6s' },
  { top: '84%', left: '52%', size: 2, delay: '0.2s', duration: '6.9s' },
  { top: '90%', left: '18%', size: 3, delay: '1.9s', duration: '8.1s' },
  { top: '92%', left: '88%', size: 2, delay: '0.7s', duration: '7.3s' },
]

export default function AcademicBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-foreground/30"
    >
      <div className="absolute inset-0 academic-grid opacity-70" />
      <div className="absolute inset-0 academic-radial opacity-80" />
      <div className="absolute inset-0 algorithm-lines opacity-45 animate-sweep" />
      <div className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-48 left-[-5%] h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />

      <svg
        className="absolute left-1/2 top-16 h-[560px] w-[560px] -translate-x-1/2 opacity-[0.18]"
        viewBox="0 0 560 560"
        fill="none"
      >
        <g
          className="animate-spin-slow"
          style={{ transformOrigin: '50% 50%', transformBox: 'fill-box' }}
        >
          <circle cx="280" cy="280" r="220" stroke="currentColor" strokeWidth="1" />
          <circle
            cx="280"
            cy="280"
            r="160"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeDasharray="4 7"
          />
          <ellipse cx="280" cy="280" rx="220" ry="90" stroke="currentColor" strokeWidth="0.8" />
          <ellipse
            cx="280"
            cy="280"
            rx="220"
            ry="90"
            stroke="currentColor"
            strokeWidth="0.8"
            transform="rotate(60 280 280)"
          />
          <ellipse
            cx="280"
            cy="280"
            rx="220"
            ry="90"
            stroke="currentColor"
            strokeWidth="0.8"
            transform="rotate(120 280 280)"
          />
        </g>
      </svg>

      <svg
        className="absolute left-[6%] top-[12%] h-[240px] w-[240px] opacity-[0.28]"
        viewBox="0 0 240 240"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
          <path d="M40 60L120 40L200 80L170 160L80 180L40 120Z" />
          <path d="M80 180L120 110L200 80" strokeDasharray="4 6" />
          <path d="M40 120L120 110L170 160" strokeDasharray="3 7" />
        </g>
        <g fill="currentColor">
          <circle cx="40" cy="60" r="3.2" />
          <circle cx="120" cy="40" r="3.2" />
          <circle cx="200" cy="80" r="3.2" />
          <circle cx="170" cy="160" r="3.2" />
          <circle cx="80" cy="180" r="3.2" />
          <circle cx="40" cy="120" r="3.2" />
          <circle cx="120" cy="110" r="3.2" />
        </g>
      </svg>

      <svg
        className="absolute right-[8%] bottom-[10%] h-[320px] w-[320px] opacity-[0.2]"
        viewBox="0 0 320 320"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.8">
          <path d="M40 80H280" strokeDasharray="5 10" />
          <path d="M60 140H260" strokeDasharray="6 12" />
          <path d="M80 200H240" strokeDasharray="4 9" />
          <path d="M100 260H220" strokeDasharray="3 7" />
          <path d="M80 60L240 260" strokeDasharray="7 10" />
          <path d="M60 260L260 80" strokeDasharray="7 10" />
        </g>
      </svg>

      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-foreground/10 opacity-60" />
        <div className="absolute inset-8 rounded-full border border-foreground/10 opacity-40" />
        <div className="absolute inset-0 animate-orbit">
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-foreground/20 shadow-[0_0_10px_rgba(15,20,35,0.2)] dark:bg-slate-300 dark:shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          <span className="absolute right-6 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground/25 dark:bg-slate-300" />
        </div>
        <div className="absolute inset-12 animate-orbit-reverse">
          <span className="absolute left-1/2 bottom-0 h-2 w-2 -translate-x-1/2 rounded-full bg-foreground/20 shadow-[0_0_12px_rgba(15,20,35,0.18)] dark:bg-slate-300 dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
          <span className="absolute left-10 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground/25 dark:bg-slate-300" />
        </div>
      </div>

      <div className="absolute top-32 left-12 h-20 w-20 rounded-full border border-foreground/10 animate-drift" />
      <div className="absolute bottom-28 right-24 h-28 w-28 rounded-full border border-foreground/10 animate-float" />

      {particles.map((particle, index) => (
        <span
          key={`particle-${index}`}
          className="particle animate-twinkle"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  )
}
