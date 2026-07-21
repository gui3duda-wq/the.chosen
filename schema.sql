-- ============================================
-- CHOSEN ONE — Script SQL para criar tabelas no Neon/PostgreSQL
-- ============================================
-- Cole este script no SQL Editor do Neon e clique em Run

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '',
    "sizes" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Coleção',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela de admin
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL
);

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '{}',
    "adminUser" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_entity_action_idx" ON "AuditLog"("entity", "action");

-- Tabela de cliques (analytics)
CREATE TABLE IF NOT EXISTS "ProductClick" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ProductClick_createdAt_idx" ON "ProductClick"("createdAt");
CREATE INDEX IF NOT EXISTS "ProductClick_productId_type_idx" ON "ProductClick"("productId", "type");
CREATE INDEX IF NOT EXISTS "ProductClick_productName_idx" ON "ProductClick"("productName");

-- ============================================
-- Inserir admin padrão (admin / admin123)
-- A senha está hasheada com scrypt
-- ============================================
INSERT INTO "Admin" ("id", "username", "password", "createdAt", "updatedAt")
VALUES (
    'admin-default-001',
    'admin',
    'f9f6ca4184dd67373fec4e0d2f7e8b1f:19e0f5f9822713d12501c0bd14cbf01901d856d26ad8a6ab0e2547279709f146a02e08b432c1c7ffff0998fa9ef4c659d910580932fe2dd64fed940d1fb0b640',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("username") DO NOTHING;

-- ============================================
-- Inserir configurações padrão
-- ============================================
INSERT INTO "SiteSetting" ("id", "key", "value") VALUES
    ('set-01', 'storeName', 'CHOSEN ONE'),
    ('set-02', 'storeTagline', 'O escolhido não erra. Apenas decide.'),
    ('set-03', 'heroTitle', 'SEJA O\nESCOLHIDO.'),
    ('set-04', 'heroSubtitle', 'Streetwear para quem não pede licença. Cada peça é uma declaração. O resto é barulho.'),
    ('set-05', 'heroBadge', 'COLEÇÃO 01 — DESTINO'),
    ('set-06', 'whatsappNumber', '5511999999999'),
    ('set-07', 'whatsappMessage', 'Olá! Tenho interesse na peça {product} (Tam: {size}) — valor R$ {price}. Quero finalizar a compra.'),
    ('set-08', 'contactEmail', 'contato@chosenone.com.br'),
    ('set-09', 'contactInstagram', '@chosenone'),
    ('set-10', 'footerText', 'CHOSEN ONE — Nascemos para ser escolhidos, não para ser mais um.'),
    ('set-11', 'logoImage', '/uploads/co-logo-red.png'),
    ('set-12', 'marqueeText', 'CHOSEN ONE • O ESCOLHIDO NÃO ERRA • VOCÊ DECIDE QUANDO TERMINA • UM PASSO DE CADA VEZ • NÃO NASCEMOS PARA SER MAIS UM •')
ON CONFLICT ("key") DO NOTHING;

-- ============================================
-- PRODUTOS: NÃO inserir produtos automaticamente.
-- O admin vai adicionar as camisetas via painel admin após o deploy.
-- ============================================

-- Pronto! O banco está populado com:
-- - 1 admin (admin / admin123)
-- - 12 configurações
-- - 0 produtos (adicione via painel admin)
