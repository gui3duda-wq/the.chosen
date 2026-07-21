'use client'

import { useState } from 'react'
import { Lock, User, Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { saveSession } from '@/lib/session'

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao entrar')
      // Save token in sessionStorage for use in Authorization header
      // (cookies may be blocked in iframe previews)
      if (data.token) {
        saveSession(data.token, data.username || username)
      }
      toast.success('Bem-vindo de volta, escolhido.')
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-2">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-foreground">Área Administrativa</h2>
        <p className="text-sm text-foreground/50 mt-1">Acesso restrito. Faça login para gerenciar a loja.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Usuário</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="mt-5 p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
        <strong>Credenciais padrão:</strong> usuário <code className="font-mono bg-primary/20 px-1 rounded">admin</code> · senha <code className="font-mono bg-primary/20 px-1 rounded">admin123</code>
        <br />
        <span className="text-primary/70">Altere-as após o primeiro acesso para maior segurança.</span>
      </div>
    </div>
  )
}
