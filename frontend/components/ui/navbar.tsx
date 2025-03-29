import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X, Github } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-background border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                MinialDoc
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-sm font-medium">
              <Link 
                href="/auth/sign-in" 
                target="_blank">
                Sign up
              </Link>
            </Button>
            <Button variant="outline" asChild className="text-sm font-medium">
              <Link 
                href="/auth/sign-in" 
                target="_blank"
                className="flex items-center gap-2"
                prefetch={true}
              >
                Sign in
              </Link>
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button variant="ghost" asChild className="text-sm font-medium w-full justify-start">
              <Link href="#features" onClick={toggleMenu}>
                Features
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm font-medium w-full justify-start">
              <Link href="/auth/sign-in">
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

