'use client'

import { useState } from 'react'
import { Loader2, Lock, KeyRound, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react'
import { toast } from 'sonner'
import { authFetchOptions } from '@/lib/session'

export default function AccountManager() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos')
      return
    }
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter ao menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('A confirmação não confere com a nova senha')
      return
    }
    if (newPassword === currentPassword) {
      toast.error('A nova senha deve ser diferente da atual')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/auth/change-password', authFetchOptions({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      }))
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `Erro ${res.status}`)
      }
      toast.success('Senha alterada com sucesso! Use a nova senha no próximo login.')
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao trocar senha')
    } finally {
      setSaving(false)
    }
  }

  const strength = (() => {
    let s = 0
    if (newPassword.length >= 6) s++
    if (newPassword.length >= 10) s++
    if (/[A-Z]/.test(newPassword)) s++
    if (/[0-9]/.test(newPassword)) s++
    if (/[^A-Za-z0-9]/.test(newPassword)) s++
    return s
  })()

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Conta & Segurança</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Altere sua senha de acesso. Use uma senha que só você conheça.</p>
      </div>

      {success && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800">Senha alterada com sucesso!</p>
            <p className="text-xs text-emerald-700 mt-0.5">Use a nova senha na próxima vez que entrar.</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-foreground">Trocar senha</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
              Senha atual
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                aria-label={showCurrent ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
              Nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                aria-label={showNew ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Strength meter */}
          {newPassword && (
            <div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      strength >= i
                        ? strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-foreground/40 mt-1.5">
                {strength <= 2 ? 'Senha fraca' : strength <= 3 ? 'Senha média' : 'Senha forte'}
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide mb-1.5 block">
              Confirmar nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type={showNew ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-destructive font-medium">As senhas não conferem.</p>
          )}

          <button
            type="submit"
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>

      <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <p className="text-xs text-foreground/60 leading-relaxed">
          <strong className="text-foreground">Dica de segurança:</strong> use uma combinação de letras
          maiúsculas, minúsculas, números e símbolos. Nunca compartilhe sua senha. Esta senha é armazenada
          com criptografia (hash) — nem mesmo o desenvolvedor consegue vê-la.
        </p>
      </div>
    </div>
  )
}
