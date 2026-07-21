'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export default function WhatsAppFloat({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)

  // Slide-in after a short delay so it doesn't appear immediately on load
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const whatsapp = settings.whatsappNumber || '5511999999999'

  const openChat = (msg: string) => {
    const link = buildWhatsAppLink(whatsapp, msg, { name: 'Atendimento', price: 0 })
    window.open(link, '_blank')
    setOpen(false)
  }

  return (
    <div
      className="fixed right-4 sm:right-5 z-40 transition-all duration-500"
      style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
    >
      {/* Quick options panel */}
      {open && (
        <div className="mb-3 w-72 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold text-sm">Fale conosco</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 space-y-2">
            <button
              onClick={() => openChat('Olá! Vim pelo site e quero saber mais sobre a CHOSEN ONE.')}
              className="w-full text-left px-3.5 py-3 rounded-xl bg-secondary hover:bg-secondary/70 border border-border transition-colors"
            >
              <div className="text-sm font-bold text-foreground">Quero comprar</div>
              <div className="text-xs text-foreground/55 mt-0.5">Tirar dúvidas e finalizar pedido</div>
            </button>
            <button
              onClick={() => openChat('Olá! Preciso de ajuda com tamanho/medidas.')}
              className="w-full text-left px-3.5 py-3 rounded-xl bg-secondary hover:bg-secondary/70 border border-border transition-colors"
            >
              <div className="text-sm font-bold text-foreground">Dúvida sobre tamanhos</div>
              <div className="text-xs text-foreground/55 mt-0.5">Tabela de medidas e indicação</div>
            </button>
            <button
              onClick={() => openChat('Olá! Quero saber sobre prazos de envio e troca.')}
              className="w-full text-left px-3.5 py-3 rounded-xl bg-secondary hover:bg-secondary/70 border border-border transition-colors"
            >
              <div className="text-sm font-bold text-foreground">Envio e troca</div>
              <div className="text-xs text-foreground/55 mt-0.5">Prazos, rastreio e políticas</div>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 bg-primary text-primary-foreground rounded-full shadow-2xl shadow-primary/30 hover:brightness-110 transition-all pl-4 pr-5 py-3.5"
        aria-label="Abrir WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-bold text-sm hidden sm:inline">Comprar no WhatsApp</span>
      </button>
    </div>
  )
}
