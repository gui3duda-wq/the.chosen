export const runtime = 'nodejs'

/**
 * Instrumentation hook — runs ONCE on server startup.
 * CONSERVADOR: NUNCA sobrescreve dados existentes.
 */
export async function register() {
  if (typeof window !== 'undefined') return

  try {
    const { db } = await import('./lib/db')
    const { hashPassword } = await import('./lib/auth')

    console.log('[instrumentation] Verificando banco...')

    // 1. Só cria admin se NÃO existir nenhum
    const adminCount = await db.admin.count().catch(() => 0)
    if (adminCount === 0) {
      console.log('[instrumentation] Criando admin padrão (admin/admin123)')
      await db.admin.create({ data: { username: 'admin', password: hashPassword('admin123') } }).catch(() => {})
    }

    // 2. Só restaura se banco estiver COMPLETAMENTE vazio
    const productCount = await db.product.count().catch(() => 0)
    const settingCount = await db.siteSetting.count().catch(() => 0)

    if (productCount > 0 || settingCount > 0) {
      console.log('[instrumentation] Banco tem dados — preservando. OK.')
      return
    }

    // Banco vazio → tentar restaurar do backup
    console.log('[instrumentation] Banco vazio — tentando restaurar do backup...')
    const fs = await import('fs')
    const path = await import('path')

    const backupFile = path.join(process.cwd(), 'db', 'backup.json')
    const historyDir = path.join(process.cwd(), 'db', 'backups')

    type Snapshot = {
      exportedAt?: string
      admin?: { username: string; password: string } | null
      settings?: Array<{ key: string; value: string }>
      products?: Array<{
        name: string; description: string; price: number; image: string
        images?: string; sizes: string; category?: string
        featured?: boolean; inStock?: boolean
      }>
    }
    let snapshot: Snapshot | null = null

    if (fs.existsSync(backupFile)) {
      try { snapshot = JSON.parse(fs.readFileSync(backupFile, 'utf-8')) } catch {}
    }
    if (!snapshot && fs.existsSync(historyDir)) {
      const files = fs.readdirSync(historyDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .map(f => ({ name: f, mtime: fs.statSync(path.join(historyDir, f)).mtime.getTime() }))
        .sort((a, b) => b.mtime - a.mtime)
      for (const f of files) {
        try {
          snapshot = JSON.parse(fs.readFileSync(path.join(historyDir, f.name), 'utf-8'))
          if (snapshot) break
        } catch {}
      }
    }

    if (snapshot) {
      console.log('[instrumentation] Restaurando do backup...')
      if (Array.isArray(snapshot.settings)) {
        for (const s of snapshot.settings) {
          await db.siteSetting.create({ data: { key: s.key, value: String(s.value) } }).catch(() => {})
        }
      }
      if (Array.isArray(snapshot.products)) {
        for (const p of snapshot.products) {
          try {
            await db.product.create({
              data: {
                name: p.name, description: p.description, price: Number(p.price),
                image: p.image, images: p.images || '', sizes: p.sizes,
                category: p.category || 'Coleção', featured: !!p.featured, inStock: p.inStock !== false,
              },
            })
          } catch {}
        }
      }
      if (snapshot.admin?.password && adminCount === 0) {
        await db.admin.update({ where: { username: 'admin' }, data: { password: snapshot.admin.password } }).catch(() => {})
      }
      console.log('[instrumentation] Restore concluído')
    } else {
      console.log('[instrumentation] Sem backup — criando dados mínimos')
      const defaults = [
        { key: 'storeName', value: 'CHOSEN ONE' },
        { key: 'storeTagline', value: 'O escolhido não erra. Apenas decide.' },
        { key: 'heroTitle', value: 'SEJA O\nESCOLHIDO.' },
        { key: 'heroSubtitle', value: 'Streetwear para quem não pede licença.' },
        { key: 'heroBadge', value: 'COLEÇÃO 01 — DESTINO' },
        { key: 'whatsappNumber', value: '5511999999999' },
        { key: 'whatsappMessage', value: 'Olá! Tenho interesse na peça {product} (Tam: {size}) — valor R$ {price}.' },
        { key: 'contactEmail', value: 'contato@chosenone.com.br' },
        { key: 'contactInstagram', value: '@chosenone' },
        { key: 'footerText', value: 'CHOSEN ONE — Nascidos para ser escolhidos.' },
        { key: 'logoImage', value: '/uploads/co-logo-red.png' },
        { key: 'marqueeText', value: 'CHOSEN ONE • O ESCOLHIDO NÃO ERRA •' },
      ]
      for (const s of defaults) {
        await db.siteSetting.create({ data: s }).catch(() => {})
      }
    }

    console.log('[instrumentation] Banco pronto')
  } catch (e) {
    console.error('[instrumentation] Erro:', e)
  }
}
