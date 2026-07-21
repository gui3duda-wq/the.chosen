'use client'

import { useEffect, useState } from 'react'
import { Lock, Menu, X } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'

export default function Navbar({
  settings,
  onOpenAdmin,
  verifyingAdmin,
}: {
  settings: SiteSettings
  onOpenAdmin: () => void
  verifyingAdmin?: boolean
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const logo = settings.logoImage || '/uploads/co-logo-final.png'
  const storeName = settings.storeName || 'CHOSEN ONE'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('top')}
          className="flex items-center gap-2.5 group"
          aria-label={storeName}
        >
          <img
            src={logo}
            alt={`${storeName} logo`}
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {[
            { label: 'Coleção', id: 'colecao' },
            { label: 'Manifesto', id: 'manifesto' },
            { label: 'Contato', id: 'contato' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative text-sm font-medium text-foreground/75 hover:text-foreground transition-colors group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <button
            onClick={onOpenAdmin}
            disabled={verifyingAdmin}
            data-no-doodle="true"
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-border text-foreground/60 hover:border-foreground hover:text-foreground transition-all disabled:opacity-50"
          >
            <Lock className="w-3 h-3" />
            {verifyingAdmin ? 'Verificando...' : 'Admin'}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-foreground"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full inset-x-0 bg-background/97 backdrop-blur-xl border-b border-border">
          <div className="px-5 py-5 flex flex-col gap-5">
            {[
              { label: 'Coleção', id: 'colecao' },
              { label: 'Manifesto', id: 'manifesto' },
              { label: 'Contato', id: 'contato' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left text-foreground font-medium text-base"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false)
                onOpenAdmin()
              }}
              className="flex items-center gap-2 text-foreground/60 text-sm font-medium pt-3 border-t border-border"
            >
              <Lock className="w-4 h-4" /> Área Admin
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
