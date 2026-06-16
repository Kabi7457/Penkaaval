import { Eye, Target, Lightbulb, Users, Globe, Shield } from 'lucide-react'
import { useEffect, useRef } from 'react'

const values = [
  { icon: Lightbulb, title: 'Innovation', description: 'Leveraging cutting-edge technology for social impact' },
  { icon: Users, title: 'Community', description: 'Building strong networks of empowered individuals' },
  { icon: Globe, title: 'Accessibility', description: 'Making safety solutions available to everyone' },
  { icon: Shield, title: 'Trust', description: 'Creating secure and reliable safety systems' },
]

export default function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.fade-in-section')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="vision" className="section-padding relative" ref={sectionRef}>
      <div className="absolute inset-0">
        <div
          className="bg-orb"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent)',
            top: '10%',
            left: '-50px',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 fade-in-section">
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">Vision &amp; Mission</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Driving change through purpose, innovation, and unwavering commitment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Vision Card */}
          <div className="glass-card-hover p-8 fade-in-section">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Eye className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              To build safer and empowered communities through innovation and collaboration.
            </p>
          </div>

          {/* Mission Card */}
          <div className="glass-card-hover p-8 fade-in-section">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-pink-500/20">
                <Target className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-purple-300 text-xl leading-relaxed font-medium">
              &ldquo;பெண்களின் பாதுகாப்பிற்கு தொழில்நுட்பத்தின் மூலம் ஒரு புதிய மாற்றம்&rdquo;
            </p>
            <p className="text-gray-400 mt-4 text-sm">
              A new transformation for women's safety through technology.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="fade-in-section">
          <h3 className="text-2xl font-bold text-center text-white mb-8">Core Values</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((item) => (
              <div key={item.title} className="glass-card-hover p-6 text-center group">
                <div className="inline-flex p-3 rounded-xl bg-purple-500/10 mb-4 group-hover:bg-purple-500/20 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
