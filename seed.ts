import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth'

/**
 * SEED SEGURO — só cria dados se não existirem. NUNCA sobrescreve.
 * Este seed cria APENAS o admin e as configurações iniciais.
 * Os produtos (camisetas) devem ser adicionados via painel admin.
 */
async function seed() {
  console.log('Verificando dados (seed seguro)...')

  // --- Admin: só cria se não existir ---
  const adminCount = await db.admin.count()
  if (adminCount === 0) {
    await db.admin.create({
      data: { username: 'admin', password: hashPassword('admin123') },
    })
    console.log('Admin criado (admin / admin123)')
  } else {
    console.log(`Admin já existe (${adminCount}) — senha preservada`)
  }

  // --- Settings: só cria se a chave não existir ---
  const existingSettings = await db.siteSetting.count()
  if (existingSettings === 0) {
    const settings = [
      { key: 'storeName', value: 'CHOSEN ONE' },
      { key: 'storeTagline', value: 'O escolhido não erra. Apenas decide.' },
      { key: 'heroTitle', value: 'SEJA O\nESCOLHIDO.' },
      { key: 'heroSubtitle', value: 'Streetwear para quem não pede licença. Cada peça é uma declaração. O resto é barulho.' },
      { key: 'heroBadge', value: 'COLEÇÃO 01 — DESTINO' },
      { key: 'whatsappNumber', value: '5511999999999' },
      { key: 'whatsappMessage', value: 'Olá! Tenho interesse na peça {product} (Tam: {size}) — valor R$ {price}. Quero finalizar a compra.' },
      { key: 'contactEmail', value: 'contato@chosenone.com.br' },
      { key: 'contactInstagram', value: '@chosenone' },
      { key: 'footerText', value: 'CHOSEN ONE — Nascemos para ser escolhidos, não para ser mais um.' },
      { key: 'logoImage', value: '/uploads/co-logo-red.png' },
      { key: 'marqueeText', value: 'CHOSEN ONE • O ESCOLHIDO NÃO ERRA • VOCÊ DECIDE QUANDO TERMINA • UM PASSO DE CADA VEZ • NÃO NASCEMOS PARA SER MAIS UM •' },
    ]
    for (const s of settings) {
      await db.siteSetting.create({ data: s })
    }
    console.log(`${settings.length} configurações criadas`)
  } else {
    console.log(`${existingSettings} configurações já existem — preservadas`)
  }

  // --- Produtos: NÃO criar produtos automaticamente ---
  // O admin vai adicionar as camisetas via painel admin após o deploy.
  const productCount = await db.product.count()
  console.log(`Produtos: ${productCount} (adicione via painel admin)`)

  console.log('Seed concluído — nenhum dado foi sobrescrito.')
}

seed()
  .catch((e) => {
    console.error('Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
