'use client'

import { useState } from 'react'
import { Instagram, Mail, Lock, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { SiteSettings } from '@/lib/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export default function Footer({
  settings,
  onOpenAdmin,
  verifyingAdmin,
}: {
  settings: SiteSettings
  onOpenAdmin: () => void
  verifyingAdmin?: boolean
}) {
  const [email, setEmail] = useState('')
  const storeName = settings.storeName || 'CHOSEN ONE'
  const footerText = settings.footerText || 'Para os que foram escolhidos.'
  const contactEmail = settings.contactEmail || 'contato@chosenone.com.br'
  const instagram = settings.contactInstagram || '@chosenone'
  const whatsapp = settings.whatsappNumber || '5511999999999'
  const logo = settings.logoImage || '/uploads/co-logo-final.png'

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast.success('Inscrição confirmada!', {
      description: 'Você foi escolhido para receber novidades em primeira mão.',
    })
    setEmail('')
  }

  const openWhatsApp = () => {
    const link = buildWhatsAppLink(
      whatsapp,
      'Olá! Vim pelo site e quero saber mais sobre a CHOSEN ONE.',
      { name: 'Atendimento', price: 0 }
    )
    window.open(link, '_blank')
  }

  return (
    <footer id="contato" className="bg-background border-t border-border mt-auto scroll-mt-20">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Entre para o time.
            </h3>
            <p className="text-foreground/55 mt-2 text-sm max-w-md">
              Lançamentos exclusivos, drops antecipados e o universo CHOSEN ONE direto no seu celular.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="flex-1 bg-secondary border border-border rounded-full px-5 py-3.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap"
            >
              Inscrever
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <img src={logo} alt={storeName} className="h-14 w-auto object-contain" />
            <p className="text-foreground/50 text-sm mt-4 max-w-sm leading-relaxed">{footerText}</p>
            <div className="flex gap-3 mt-5">
              <a
                href={`https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                onClick={openWhatsApp}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <a
                href={`mailto:${contactEmail}`}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-colors"
                aria-label="E-mail"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-bold text-xs uppercase tracking-[0.2em] mb-4">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Coleção', id: 'colecao' },
                { label: 'Manifesto', id: 'manifesto' },
                { label: 'Contato', id: 'contato' },
              ].map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-foreground/60 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-bold text-xs uppercase tracking-[0.2em] mb-4">Contato</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={openWhatsApp} className="text-foreground/60 hover:text-primary transition-colors text-left">
                  WhatsApp direto
                </button>
              </li>
              <li className="text-foreground/60">{contactEmail}</li>
              <li className="text-foreground/60">{instagram}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-7 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-xs">
            © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
          </p>
          <button
            onClick={onOpenAdmin}
            disabled={verifyingAdmin}
            className="inline-flex items-center gap-1.5 text-foreground/40 hover:text-foreground/70 text-xs transition-colors disabled:opacity-50"
          >
            <Lock className="w-3 h-3" />
            {verifyingAdmin ? 'Verificando...' : 'Área administrativa'}
          </button>
        </div>
      </div>
    </footer>
  )
}
