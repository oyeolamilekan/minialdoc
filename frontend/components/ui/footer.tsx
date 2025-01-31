import Link from "next/link"
import { Twitter, TwitterIcon as TikTok } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-16 px-8 rounded-t-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Primary Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold uppercase text-sm tracking-wider">Primary</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
              <li><Link href="/changelog" className="hover:text-blue-500 transition-colors">Changelog</Link></li>
              <li><Link href="/guide" className="hover:text-blue-500 transition-colors">Guide</Link></li>
              <li><Link href="/support" className="hover:text-blue-500 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Other Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold uppercase text-sm tracking-wider">Other</h3>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="hover:text-blue-500 transition-colors">Pricing</Link></li>
              <li><Link href="/comparisons" className="hover:text-blue-500 transition-colors">Comparisons</Link></li>
              <li><Link href="/guides" className="hover:text-blue-500 transition-colors">Guides</Link></li>
              <li><Link href="/copilot" className="hover:text-blue-500 transition-colors">Productivity Copilot</Link></li>
              <li><Link href="/tool-finder" className="hover:text-blue-500 transition-colors">ApiCraft on Tool Finder</Link></li>
              <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
              <li><Link href="/register" className="hover:text-blue-500 transition-colors">Register</Link></li>
              <li><Link href="/login" className="hover:text-blue-500 transition-colors">Login</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">Want to follow along as I build ApiCraft? I share my progress publicly 👋</p>
            <div className="space-y-3">
              <Link href="https://twitter.com/apicraft" className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span>@apicraft</span>
              </Link>
              <Link href="https://tiktok.com/@apicraft" className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <TikTok className="h-5 w-5" />
                <span>@apicraft</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-500">© 2024 ApiCraft, LLC. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
