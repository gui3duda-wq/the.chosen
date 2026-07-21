# CHOSEN ONE — Deploy na Vercel (Passo a Passo)

## Pré-requisitos
- Conta no GitHub
- Os arquivos desta pasta

---

## PASSO 1: Subir os arquivos para o GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `chosen-one` (ou outro nome)
3. Marque **Private** (privado)
4. Clique em **Create repository**
5. Na página do repositório, clique em **"uploading an existing file"**
6. **Arraste TODOS os arquivos desta pasta** para a área de upload
   - ⚠️ Importante: são os arquivos DENTRO desta pasta, não a pasta inteira
   - Você deve ver: `package.json`, `src/`, `prisma/`, `public/`, etc.
7. Mensagem do commit: "Upload do site CHOSEN ONE"
8. Clique em **Commit changes**

---

## PASSO 2: Criar banco PostgreSQL grátis (Neon)

1. Acesse https://neon.tech e clique em **Sign up**
2. Entre com sua conta GitHub
3. Clique em **New Project**:
   - Name: `chosen-one`
   - Region: escolha a mais próxima (ex: AWS São Paulo ou US East)
4. Após criar, copie a **Connection String** que aparece:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
5. **Guarde esta string** — vamos usar na Vercel

---

## PASSO 3: Fazer deploy na Vercel

1. Acesse https://vercel.com/signup
2. Entre com sua conta GitHub (mesma do Passo 1)
3. No painel, clique em **"Add New..." → "Project"**
4. Selecione o repositório `chosen-one`
5. A Vercel detecta automaticamente que é Next.js
6. Na seção **"Environment Variables"**, adicione:
   - **Nome**: `DATABASE_URL`
   - **Valor**: cole a connection string do Neon (Passo 2)
7. Clique em **"Add"** e depois em **"Deploy"**
8. Aguarde 2-3 minutos (vai compilar o build)
9. Quando aparecer "Congratulations!" — seu site está no ar! 🎉

---

## PASSO 4: Criar as tabelas no banco

Após o deploy, o banco está vazio. Para preencher:

### Opção A: Pelo painel do Neon (mais fácil)
1. No painel do Neon, vá em **"SQL Editor"**
2. Cole o conteúdo do arquivo `schema.sql` (que está nesta pasta)
3. Clique em **Run**
4. Depois rode o seed para criar o admin e produtos iniciais

### Opção B: Pelo terminal (mais técnico)
1. Instale a Vercel CLI: `npm i -g vercel`
2. Faça login: `vercel login`
3. Dentro da pasta do projeto: `vercel link`
4. Baixe as variáveis: `vercel env pull .env.production.local`
5. Rode: `npx prisma db push`
6. Rode: `npx prisma db seed` (ou `npx tsx prisma/seed.ts`)

---

## PASSO 5: Acessar o site

- A Vercel dará uma URL: `https://chosen-one.vercel.app`
- **Login admin**: clique em "Admin" no topo
- **Usuário**: `admin`
- **Senha**: `admin123`
- ⚠️ **Troque a senha imediatamente** em "Conta & Senha"

---

## PASSO 6 (Opcional): Conectar seu domínio próprio

1. Compre um domínio (Registro.br, Namecheap, etc.)
2. Na Vercel: Settings → Domains → Add
3. Digite seu domínio (ex: `chosenone.com.br`)
4. Configure o DNS no painel onde comprou o domínio:
   - Adicione um registro **A** apontando para `76.76.21.21`
   - Ou **CNAME** apontando para `cname.vercel-dns.com`
5. Aguarde 5-30 minutos
6. Pronto! HTTPS grátis gerado automaticamente pela Vercel

---

## Estrutura dos arquivos

```
chosen-one/
├── src/                    # Código-fonte (páginas, APIs, componentes)
│   ├── app/               # Páginas e rotas da API
│   ├── components/         # Componentes React (admin + vitrine)
│   └── lib/               # Utilitários (auth, db, whatsapp, etc.)
├── prisma/                # Schema do banco + scripts de seed
│   ├── schema.prisma      # Schema PostgreSQL
│   ├── seed.ts            # Dados iniciais (admin + 15 produtos)
│   └── auto-restore.ts    # Restauração automática
├── public/                # Imagens (logo + camisetas)
│   └── uploads/           # Fotos das peças
├── db/                    # Backups (não usado em produção)
├── package.json           # Dependências e scripts
├── next.config.ts         # Configuração do Next.js
├── .env.example           # Template das variáveis de ambiente
├── schema.sql             # SQL para criar tabelas no Neon
└── README-VERCEL.md       # Este arquivo
```

---

## Funcionalidades do site

- ✅ Vitrine com 15 camisetas (fotos frente/costas)
- ✅ Barra de pesquisa por nome
- ✅ Botão WhatsApp com mensagem automática + foto
- ✅ Painel admin completo:
  - Produtos (criar, editar, excluir, múltiplas imagens)
  - Aparência & Conteúdo (textos, logo, WhatsApp)
  - Conta & Senha (trocar senha com segurança)
  - Analytics (gráficos de cliques e conversão)
  - Histórico (log de todas as alterações)
- ✅ Sistema de backup automático
- ✅ Responsivo mobile

---

## Suporte

Se algo der errado durante o deploy, verifique:
1. Se a `DATABASE_URL` está correta no painel da Vercel
2. Se o schema.prisma está com `provider = "postgresql"`
3. Se as tabelas foram criadas (Passo 4)

Dúvidas? Consulte o desenvolvedor.
