# CHOSEN ONE — Guia de Instalação e Hospedagem

## Requisitos
- Node.js 18+ ou Bun
- Um provedor de banco de dados (SQLite para dev, PostgreSQL para produção)

## Instalação local

1. Instale as dependências:
   ```bash
   bun install
   ```
   (ou `npm install` se não tiver Bun)

2. Configure o banco de dados:
   - Copie `.env.example` para `.env`
   - Ajuste a `DATABASE_URL` conforme seu banco

3. Crie as tabelas e dados iniciais:
   ```bash
   bun run db:push
   bun run prisma/seed.ts
   ```

4. Rode o servidor de desenvolvimento:
   ```bash
   bun run dev
   ```

5. Acesse: http://localhost:3000

## Acesso Admin
- URL: http://localhost:3000 (clique em "Admin" no topo)
- Usuário: `admin`
- Senha: `admin123`
- **Troque a senha imediatamente após o primeiro login!**

## Hospedagem Gratuita (recomendado: Vercel + Neon)

### 1. Subir para o GitHub
- Crie um repositório no GitHub
- Suba todos os arquivos deste pacote

### 2. Banco PostgreSQL (Neon)
- Crie conta em https://neon.tech
- Crie um projeto e copie a connection string
- Altere `prisma/schema.prisma`:
  ```
  datasource db {
    provider = "postgresql"  // mude de sqlite para postgresql
    url      = env("DATABASE_URL")
  }
  ```

### 3. Deploy na Vercel
- Crie conta em https://vercel.com (entre com GitHub)
- Importe o repositório
- Adicione a variável de ambiente:
  - DATABASE_URL = (cole a string do Neon)
- Deploy!

### 4. Popular o banco
Após o deploy, rode uma vez:
```bash
vercel env pull .env.production
bun run db:push
bun run prisma/seed.ts
```

## Estrutura do projeto

- `src/app/` — páginas e APIs (Next.js App Router)
- `src/components/storefront/` — componentes da vitrine pública
- `src/components/admin/` — componentes do painel admin
- `src/lib/` — utilitários (auth, db, whatsapp, etc.)
- `prisma/` — schema do banco e scripts de seed
- `public/uploads/` — imagens das camisetas e logo

## Funcionalidades

- ✅ Vitrine de produtos com fotos (frente/costas)
- ✅ Barra de pesquisa
- ✅ Botão WhatsApp com mensagem automática + foto
- ✅ Painel admin completo:
  - Produtos (criar, editar, excluir, múltiplas imagens)
  - Aparência & Conteúdo (editar textos, logo, WhatsApp)
  - Conta & Senha (trocar senha com segurança)
  - Analytics (gráficos de cliques e conversão)
  - Histórico (log de todas as alterações)
- ✅ Sistema de backup automático
- ✅ Persistência garantida (sobrevive a resets)
- ✅ Responsivo mobile

## Suporte

Para dúvidas ou problemas, consulte o desenvolvedor.
