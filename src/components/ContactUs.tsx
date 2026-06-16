import { Mail, Phone, Instagram, MapPin, ExternalLink } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'theunbrand307@gmail.com',
    href: 'mailto:theunbrand307@gmail.com',
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 6384645259',
    href: 'tel:+916384645259',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@penkaaval',
    href: 'https://instagram.com/penkaaval',
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
  },
]

export default function ContactUs() {
  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0">
        <div
          className="bg-orb"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent)',
            top: '30%',
            left: '-80px',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">Contact Us</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Have questions or want to collaborate? Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {contactInfo.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.label === 'Instagram' ? '_blank' : undefined}
              rel={item.label === 'Instagram' ? 'noopener noreferrer' : undefined}
              className="glass-card-hover p-8 text-center group block"
              id={`contact-${item.label.toLowerCase()}`}
            >
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>
              <h3 className="text-white font-semibold mb-2">{item.label}</h3>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                {item.value}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </a>
          ))}
        </div>

        {/* Location Note */}
        <div className="glass-card p-6 mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>Tamil Nadu, India</span>
          </div>
        </div>
      </div>
    </section>
  )
}
