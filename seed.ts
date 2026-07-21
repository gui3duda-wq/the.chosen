import { db } from '../src/lib/db'
import { hashPassword, verifyPassword } from '../src/lib/auth'
import fs from 'fs'
import path from 'path'

/**
 * AUTO-RESTORE CONSERVADOR — só age em casos extremos.
 *
 * IMPORTANTE: NUNCA sobrescreve dados existentes.
 * Só restaura se o banco estiver COMPLETAMENTE VAZIO.
 *
 * Comportamento:
 * - Se o banco tem QUALQUER dado → não faz nada (preserva suas edições)
 * - Se o banco está totalmente vazio → restaura do backup mais recente
 * - Se não há backup → cria admin padrão + roda seed
 */
async function autoRestore() {
  const productCount = await db.product.count()
  const settingCount = await db.siteSetting.count()
  const adminCount = await db.admin.count()

  console.log(`[auto-restore] Estado: ${productCount} produtos, ${settingCount} settings, ${adminCount} admins`)

  // CASO 1: Banco tem dados → NÃO FAZ NADA (preserva edições do admin)
  if (productCount > 0 || settingCount > 0 || adminCount > 0) {
    console.log('[auto-restore] Banco tem dados — preservando edições do admin. Nenhuma ação.')
    return
  }

  // CASO 2: Banco completamente vazio → restaurar do backup
  console.log('[auto-restore] Banco vazio detectado — tentando restaurar do backup...')

  // Garantir admin padrão
  console.log('[auto-restore] Criando admin padrão (admin/admin123)')
  await db.admin.create({ data: { username: 'admin', password: hashPassword('admin123') } })

  const BACKUP_DIR = path.join(process.cwd(), 'db')
  const LATEST_BACKUP = path.join(BACKUP_DIR, 'backup.json')
  const HISTORY_DIR = path.join(BACKUP_DIR, 'backups')

  // Encontrar backup mais recente
  let snapshot: any = null
  if (fs.existsSync(LATEST_BACKUP)) {
    try { snapshot = JSON.parse(fs.readFileSync(LATEST_BACKUP, 'utf-8')) } catch {}
  }
  if (!snapshot && fs.existsSync(HISTORY_DIR)) {
    const files = fs.readdirSync(HISTORY_DIR)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(f => ({ name: f, mtime: fs.statSync(path.join(HISTORY_DIR, f)).mtime.getTime() }))
      .sort((a, b) => b.mtime - a.mtime)
    for (const f of files) {
      try {
        snapshot = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, f.name), 'utf-8'))
        if (snapshot) break
      } catch {}
    }
  }

  if (!snapshot) {
    console.log('[auto-restore] Nenhum backup encontrado — rode seed manualmente')
    return
  }

  console.log(`[auto-restore] Restaurando do backup de ${snapshot.exportedAt || 'data desconhecida'}`)

  // Restaurar settings
  if (Array.isArray(snapshot.settings)) {
    for (const s of snapshot.settings) {
      await db.siteSetting.create({ data: { key: s.key, value: String(s.value) } })
    }
    console.log(`[auto-restore] ${snapshot.settings.length} configurações restauradas`)
  }

  // Restaurar products
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
      } catch (e) {
        console.error(`[auto-restore] Erro ao restaurar produto "${p.name}":`, e)
      }
    }
    console.log(`[auto-restore] ${snapshot.products.length} produtos restaurados`)
  }

  // Restaurar senha customizada do backup (se não for a padrão)
  if (snapshot.admin?.password) {
    const isDefault = verifyPassword('admin123', snapshot.admin.password)
    if (!isDefault) {
      await db.admin.update({ where: { username: 'admin' }, data: { password: snapshot.admin.password } })
      console.log('[auto-restore] Senha customizada do admin restaurada')
    }
  }

  console.log('[auto-restore] Restore concluído!')
}

autoRestore()
  .catch((e) => {
    console.error('[auto-restore] Erro:', e)
    // Não abortar — deixar o servidor iniciar
  })
  .finally(async () => {
    await db.$disconnect()
  })
