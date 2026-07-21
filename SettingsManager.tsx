'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Save, Store, Megaphone, Mail, MessageCircle, Image as ImageIcon } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { toast } from 'sonner'
import { authFetchOptions } from '@/lib/session'

export default function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => setSettings(d.settings || {}))
      .finally(() => setLoading(false))
  }, [])

  // Stable callback — never recreated, so child inputs keep focus across re-renders
  const update = useCallback((key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', authFetchOptions({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      }))
      if (!res.ok) throw new Error('Erro ao salvar')
      toast.success('Configurações salvas!')
      setTimeout(() => window.location.reload(), 800)
    } catch {
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-foreground/40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Personalize os textos, contato e identidade da loja.</p>
      </div>

      <div className="space-y-6">
        {/* Brand */}
        <section className="bg-card rounded-2xl border border-border p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground">Identidade da marca</h2>
          </div>
          <div className="space-y-4">
            <Field label="Nome da loja" value={settings.storeName || ''} onChange={(v) => update('storeName', v)} placeholder="CHOSEN ONE" />
            <Field label="Slogan / Tagline" value={settings.storeTagline || ''} onChange={(v) => update('storeTagline', v)} placeholder="O escolhido não erra." />
            <div>
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
                Logo (URL do arquivo)
              </label>
              <div className="flex gap-3 items-start">
                <div className="w-16 h-16 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0">
                  {settings.logoImage ? (
                    <img src={settings.logoImage} alt="logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-foreground/30" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    value={settings.logoImage || ''}
                    onChange={(e) => update('logoImage', e.target.value)}
                    placeholder="/uploads/co-logo-red.png"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-[11px] text-foreground/40 mt-1">Caminho da imagem da logo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="bg-card rounded-2xl border border-border p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground">Seção principal (Hero)</h2>
          </div>
          <div className="space-y-4">
            <Field label="Selo / Badge" value={settings.heroBadge || ''} onChange={(v) => update('heroBadge', v)} placeholder="COLEÇÃO 01 — DESTINO" />
            <Field label="Título principal" value={settings.heroTitle || ''} onChange={(v) => update('heroTitle', v)} placeholder="SEJA O&#10;ESCOLHIDO." textarea hint="Pressione Enter para quebrar a linha (ex: SEJA O / ESCOLHIDO.)." />
            <Field label="Subtítulo" value={settings.heroSubtitle || ''} onChange={(v) => update('heroSubtitle', v)} placeholder="Streetwear motivacional..." textarea />
            <Field label="Texto da faixa rolante (marquee)" value={settings.marqueeText || ''} onChange={(v) => update('marqueeText', v)} placeholder="CHOSEN ONE • O ESCOLHIDO NÃO ERRA • ..." />
          </div>
        </section>

        {/* WhatsApp */}
        <section className="bg-card rounded-2xl border border-primary/30 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground">Integração WhatsApp</h2>
          </div>
          <div className="space-y-4">
            <Field
              label="Número do WhatsApp"
              value={settings.whatsappNumber || ''}
              onChange={(v) => update('whatsappNumber', v)}
              placeholder="5511999999999"
              hint="Formato: código do país + DDD + número, sem espaços ou símbolos. Ex: 5511999999999"
            />
            <Field
              label="Mensagem padrão"
              value={settings.whatsappMessage || ''}
              onChange={(v) => update('whatsappMessage', v)}
              placeholder="Olá! Tenho interesse na peça {product} (Tam: {size}) — valor R$ {price}."
              textarea
              hint="Variáveis disponíveis: {product} (nome), {size} (tamanho), {price} (preço)."
            />
          </div>
        </section>

        {/* Contact */}
        <section className="bg-card rounded-2xl border border-border p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground">Contato & Rodapé</h2>
          </div>
          <div className="space-y-4">
            <Field label="E-mail de contato" value={settings.contactEmail || ''} onChange={(v) => update('contactEmail', v)} placeholder="contato@sualoja.com.br" />
            <Field label="Instagram" value={settings.contactInstagram || ''} onChange={(v) => update('contactInstagram', v)} placeholder="@sualoja" />
            <Field label="Texto do rodapé" value={settings.footerText || ''} onChange={(v) => update('footerText', v)} placeholder="Para os que foram escolhidos." textarea />
          </div>
        </section>

        {/* Save bar — positioned above browser bottom bar with safe-area padding */}
        <div
          className="sticky flex justify-end pt-4"
          style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar configurações
          </button>
        </div>
      </div>

      {/* Domain note */}
      <div className="mt-8 p-5 rounded-2xl bg-card border border-border">
        <h3 className="text-foreground font-bold text-sm mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Sobre domínio próprio e publicação
        </h3>
        <p className="text-foreground/60 text-xs leading-relaxed">
          Esta loja é construída em Next.js, pronta para deploy. Para publicar com seu próprio domínio:
          faça deploy em plataformas como Vercel ou Netlify, conecte seu domínio registrado (Registro.br,
          GoDaddy, etc.) nas configurações DNS, e pronto — sua loja estará no ar profissionalmente.
        </p>
      </div>
    </div>
  )
}

// Field is defined OUTSIDE the parent component so it has a stable identity
// across re-renders. (Defining it inside caused the input to lose focus on each keystroke.)
function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  textarea?: boolean
  hint?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
      )}
      {hint && <p className="text-[11px] text-foreground/40 mt-1">{hint}</p>}
    </div>
  )
}
