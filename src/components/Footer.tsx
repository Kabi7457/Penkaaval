import { Shield, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4" id="footer">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <span className="font-display font-bold text-gradient">PenKaaval</span>
        </div>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          Built with <Heart className="w-4 h-4 text-pink-500" /> for safer communities
        </p>
        <p className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} PenKaaval. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
