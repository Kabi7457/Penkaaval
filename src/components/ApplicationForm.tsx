import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Briefcase, Heart } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import confetti from 'canvas-confetti'

const districts = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
  'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam',
  'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
  'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
  'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
  'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar',
]

const interestOptions = [
  { value: 'Volunteer', label: 'Volunteer', icon: '🤝' },
  { value: 'Learner', label: 'Learner', icon: '📚' },
  { value: 'Technical Team', label: 'Technical Team', icon: '💻' },
  { value: 'District Team', label: 'District Team', icon: '🗺️' },
  { value: 'Social Media Team', label: 'Social Media Team', icon: '📱' },
]

interface FormData {
  fullName: string
  email: string
  phone: string
  district: string
  currentStatus: string
  interests: string[]
  reason: string
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    district: '',
    currentStatus: '',
    interests: [],
    reason: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) return 'Please enter your full name'
    if (!formData.email.trim()) return 'Please enter your email address'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address'
    if (!formData.phone.trim()) return 'Please enter your phone number'
    if (!/^[+]?[\d\s-]{10,15}$/.test(formData.phone.replace(/\s/g, '')))
      return 'Please enter a valid phone number'
    if (!formData.district) return 'Please select your district'
    if (!formData.currentStatus) return 'Please select your current status'
    if (formData.interests.length === 0) return 'Please select at least one area of interest'
    if (!formData.reason.trim()) return 'Please tell us why you want to join PenKaaval'
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase.from('team_applications').insert({
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        district: formData.district,
        current_status: formData.currentStatus,
        interests: formData.interests,
        reason: formData.reason.trim(),
      })

      if (error) {
        if (error.code === '23505') {
          setSubmitStatus('duplicate')
          setErrorMessage('This email has already been used to submit an application.')
        } else {
          throw error
        }
      } else {
        setSubmitStatus('success')
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7c3aed', '#a78bfa', '#ec4899', '#f472b6'],
        })
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          district: '',
          currentStatus: '',
          interests: [],
          reason: '',
        })
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <section id="join" className="section-padding relative">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-12">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Application Submitted!</h3>
            <p className="text-gray-400 text-lg mb-8">
              Thank you for your interest in PenKaaval. We'll review your application and get back to you soon.
            </p>
            <button onClick={() => setSubmitStatus('idle')} className="btn-secondary">
              Submit Another Application
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="join" className="section-padding relative">
      <div className="absolute inset-0">
        <div
          className="bg-orb"
          style={{
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent)',
            top: '20%',
            right: '-100px',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            <span className="text-gradient">Join Our Team</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Be part of the change. Join PenKaaval and help us build safer communities through technology and innovation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-10 space-y-6">
          {/* Error / Duplicate Banner */}
          {(submitStatus === 'error' || submitStatus === 'duplicate') && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 text-purple-400" /> Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter your full name"
              className="input-field"
              id="form-full-name"
            />
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 text-purple-400" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-field"
                id="form-email"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 text-purple-400" /> Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                className="input-field"
                id="form-phone"
              />
            </div>
          </div>

          {/* District */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 text-purple-400" /> District
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              className="input-field appearance-none cursor-pointer"
              id="form-district"
            >
              <option value="" className="bg-[#1a0a2e]">Select your district</option>
              {districts.map((d) => (
                <option key={d} value={d} className="bg-[#1a0a2e]">{d}</option>
              ))}
            </select>
          </div>

          {/* Current Status */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <Briefcase className="w-4 h-4 text-purple-400" /> Current Status
            </label>
            <div className="flex flex-wrap gap-3">
              {['Student', 'Working Professional', 'Other'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, currentStatus: status }))}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    formData.currentStatus === status
                      ? 'bg-purple-500/30 border-purple-400/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  } border`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Areas of Interest */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <Heart className="w-4 h-4 text-purple-400" /> Areas of Interest
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interestOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleInterest(option.value)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    formData.interests.includes(option.value)
                      ? 'bg-purple-500/30 border-purple-400/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  } border`}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Why do you want to join PenKaaval?
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Tell us about your motivation..."
              rows={4}
              className="input-field resize-none"
              id="form-reason"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            id="form-submit"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Apply Now
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
