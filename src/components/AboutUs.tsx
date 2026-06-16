import { Shield, Heart, Zap, Lock } from 'lucide-react'
import { useEffect, useRef } from 'react'

const highlights = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Every solution we build prioritizes the safety and well-being of women in our communities.',
  },
  {
    icon: Heart,
    title: 'Community Driven',
    description: 'Our strength lies in the passionate volunteers and team members who drive our mission forward.',
  },
  {
    icon: Zap,
    title: 'Tech Powered',
    description: 'We harness the power of modern technology to create innovative safety solutions.',
  },
  {
    icon: Lock,
    title: 'Privacy Focused',
    description: 'We maintain the highest standards of data privacy and security in everything we build.',
  },
]

export default function AboutUs() {
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
    <section id="about" className="section-padding relative" ref={sectionRef}>
      <div className="absolute inset-0">
        <div
          className="bg-orb"
          style={{
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent)',
            bottom: '10%',
            right: '-100px',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 fade-in-section">
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">About Us</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            PenKaaval is a community-driven initiative dedicated to building safer communities
            through technology, innovation, and collaboration. We bring together passionate
            individuals from diverse backgrounds to create meaningful impact in women's safety.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="glass-card-hover p-8 fade-in-section"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                  <item.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
