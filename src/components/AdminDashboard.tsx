import { useState, useEffect, useCallback } from 'react'
import {
  Shield, LogIn, LogOut, Search, Filter, Users, MapPin,
  CheckCircle, XCircle, Phone as PhoneIcon, Mail, RefreshCw,
  BarChart3, UserCheck, BookOpen, Building2, Eye, EyeOff,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  district: string
  current_status: string
  interests: string[]
  reason: string
  application_status: string
  created_at: string
}

const statCards = [
  { label: 'Total Applications', key: 'total' as const, icon: BarChart3, iconClass: 'text-purple-400' },
  { label: 'Volunteers', key: 'volunteers' as const, icon: UserCheck, iconClass: 'text-green-400' },
  { label: 'Learners', key: 'learners' as const, icon: BookOpen, iconClass: 'text-blue-400' },
  { label: 'Districts', key: 'districts' as const, icon: Building2, iconClass: 'text-pink-400' },
]

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApps, setFilteredApps] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterDistrict, setFilterDistrict] = useState('')
  const [filterInterest, setFilterInterest] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Check existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthenticated(true)
    })
  }, [])

  const handleLogin = async () => {
    setIsLoggingIn(true)
    setLoginError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setIsAuthenticated(true)
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setApplications([])
    setFilteredApps([])
  }

  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('team_applications')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setApplications(data || [])
      setFilteredApps(data || [])
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) fetchApplications()
  }, [isAuthenticated, fetchApplications])

  // Filter logic
  useEffect(() => {
    let results = [...applications]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.includes(q)
      )
    }
    if (filterDistrict) results = results.filter((a) => a.district === filterDistrict)
    if (filterInterest) results = results.filter((a) => a.interests.includes(filterInterest))
    if (filterStatus) results = results.filter((a) => a.application_status === filterStatus)

    setFilteredApps(results)
  }, [searchQuery, filterDistrict, filterInterest, filterStatus, applications])

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('team_applications')
        .update({ application_status: status })
        .eq('id', id)
      if (error) throw error
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, application_status: status } : a))
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const districts = [...new Set(applications.map((a) => a.district))].sort()
  const allInterests = [...new Set(applications.flatMap((a) => a.interests))].sort()

  const stats = {
    total: applications.length,
    volunteers: applications.filter((a) => a.interests.includes('Volunteer')).length,
    learners: applications.filter((a) => a.interests.includes('Learner')).length,
    districts: new Set(applications.map((a) => a.district)).size,
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0118]">
        <div className="absolute inset-0">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
        </div>
        <div className="glass-card p-8 sm:p-10 max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-xl bg-purple-500/20 mb-4">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-500 text-sm">Sign in to access the dashboard</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-6">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@penkaaval.com"
                className="input-field"
                id="admin-email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  id="admin-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              id="admin-login-btn"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-[#0a0118] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white font-display">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">PenKaaval Applications</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchApplications}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              title="Refresh"
              id="admin-refresh-btn"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm"
              id="admin-logout-btn"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>
              <div className="text-3xl font-bold text-white">{stats[stat.key]}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="input-field pl-10 text-sm"
                  id="admin-search"
                />
              </div>
            </div>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="input-field text-sm w-auto min-w-[150px]"
              id="admin-filter-district"
            >
              <option value="" className="bg-[#1a0a2e]">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d} className="bg-[#1a0a2e]">{d}</option>
              ))}
            </select>
            <select
              value={filterInterest}
              onChange={(e) => setFilterInterest(e.target.value)}
              className="input-field text-sm w-auto min-w-[150px]"
              id="admin-filter-interest"
            >
              <option value="" className="bg-[#1a0a2e]">All Interests</option>
              {allInterests.map((i) => (
                <option key={i} value={i} className="bg-[#1a0a2e]">{i}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field text-sm w-auto min-w-[140px]"
              id="admin-filter-status"
            >
              <option value="" className="bg-[#1a0a2e]">All Status</option>
              <option value="Pending" className="bg-[#1a0a2e]">Pending</option>
              <option value="Accepted" className="bg-[#1a0a2e]">Accepted</option>
              <option value="Rejected" className="bg-[#1a0a2e]">Rejected</option>
              <option value="Contacted" className="bg-[#1a0a2e]">Contacted</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>Showing {filteredApps.length} of {applications.length} applications</span>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="glass-card p-12 text-center">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div key={app.id} className="glass-card p-6 hover:bg-white/[0.07] transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-white truncate">{app.full_name}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.application_status === 'Accepted'
                            ? 'bg-green-500/20 text-green-400'
                            : app.application_status === 'Rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : app.application_status === 'Contacted'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {app.application_status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {app.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <PhoneIcon className="w-3.5 h-3.5" /> {app.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {app.district}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs">
                        {app.current_status}
                      </span>
                      {app.interests.map((interest) => (
                        <span key={interest} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2">{app.reason}</p>

                    <p className="text-gray-600 text-xs mt-2">
                      Applied:{' '}
                      {new Date(app.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(app.id, 'Accepted')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-medium transition-all"
                      title="Accept"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, 'Rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all"
                      title="Reject"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, 'Contacted')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-all"
                      title="Mark Contacted"
                    >
                      <PhoneIcon className="w-3.5 h-3.5" /> Contacted
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
