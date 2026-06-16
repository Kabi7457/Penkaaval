import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Building Safer Communities</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-black mb-6 animate-slide-up">
          <span className="text-gradient">PenKaaval</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-light mb-4 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          Empowering Safer Communities Through Technology
        </p>

        {/* Tamil Tagline */}
        <p
          className="text-lg sm:text-xl text-purple-300/80 font-medium mb-12 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          பெண்களின் பாதுகாப்பிற்கு தொழில்நுட்பத்தின் மூலம் ஒரு புதிய மாற்றம்
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <button
            onClick={() => scrollTo('join')}
            className="btn-primary flex items-center justify-center gap-2 text-lg"
            id="cta-join"
          >
            Join Our Team
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo('vision')}
            className="btn-secondary text-lg"
            id="cta-learn-more"
          >
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          {[
            { value: 'Community', label: 'Driven' },
            { value: 'Technology', label: 'Powered' },
            { value: 'Impact', label: 'Focused' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-purple-500/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-purple-400 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
