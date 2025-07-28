# Quikpad

Um conjunto de ferramentas web minimalistas e rápidas para produtividade, construído com foco em simplicidade e baixo custo.

## 🌐 Acesse Online

- **🏠 Quikpad:** [quikpad.cc](https://quikpad.cc)
- **📝 QuikNote:** [quiknote.cc](https://quiknote.cc)
- **💻 QuikCode:** [quikcode.cc](https://quikcode.cc)

## 📋 Sobre o Projeto

**Quikpad** é composto por três aplicações principais:

- **🏠 Quikpad** - Portal central que agrega e redireciona para as outras ferramentas
- **📝 QuikNote** - Editor de rich-text (estilo Notion básico) com exportação para Markdown e PDF
- **💻 QuikCode** - Editor de código leve com syntax highlighting, temas e exportação para texto/imagem

### ✨ Características

- **Monorepo** com pnpm workspaces + Turborepo
- **TypeScript** em todo o stack
- **Client-Side Rendering** (React + Vite)
- **PWA** com funcionamento offline básico
- **Baixo custo** de hospedagem e manutenção

## 🏗️ Arquitetura

```
/apps/hub       # Portal QuikPad (React + Vite)
/apps/note      # Editor de Notas (React + Vite + TipTap)
/apps/code      # Editor de Código (React + Vite + Prism Editor)
/packages/ui    # Componentes compartilhados (Tailwind CSS)
/packages/api   # Tipos e client de API
/backend        # API Express.js + TypeScript + MongoDB
```

### 🛠️ Stack Tecnológica

**Frontend:**
- React 18 + Vite + TypeScript
- React Router v6
- Tailwind CSS
- TipTap v3 (QuikNote)
- Prism Editor (QuikCode)

**Backend:**
- Express.js + TypeScript
- MongoDB
- PM2 (Process Manager)

## 🚀 Desenvolvimento Local

### Pré-requisitos

- Node.js 20+
- pnpm
- MongoDB (local ou Atlas)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/badmuriss/quikpad.git
cd quikpad

# Instale as dependências
pnpm install

# Execute o ambiente de desenvolvimento
pnpm run dev
```

### 🌐 URLs de Desenvolvimento

Após executar `pnpm run dev`, as aplicações estarão disponíveis em:

- **Hub:** http://localhost:5173
- **Note:** http://localhost:6001  
- **Code:** http://localhost:6002
- **Backend API:** http://localhost:3001

### ⚙️ Variáveis de Ambiente

As aplicações funcionam com configurações padrão, mas você pode personalizar criando arquivos `.env` nas pastas raiz de cada app:

**Backend (`/backend/.env`):**
```env
MONGO_URI=mongodb://localhost:27017/quikpad
MONGO_DB=quikpad
NOTES_COLLECTION=quikNotes
CODES_COLLECTION=quikCodes
NODE_ENV=development
```

**Apps Frontend (`/apps/hub/.env`, `/apps/note/.env`, `/apps/code/.env`):**
```env
# Hub
VITE_QUIKNOTE_URL=http://localhost:6001
VITE_QUIKCODE_URL=http://localhost:6002

# Note e Code
VITE_API_ENDPOINT=http://localhost:3001
```

## 🤝 Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

### 📝 Padrões de Desenvolvimento

- Use **TypeScript** em todo o código
- Siga os padrões do **ESLint**

### 🧪 Comandos Úteis

```bash
# Lint
pnpm run lint

# Build de produção
pnpm run build

# Executar apenas um app específico
pnpm run dev --filter=note
pnpm run dev --filter=code
pnpm run dev --filter=hub
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links

- **Repositório:** https://github.com/badmuriss/quikpad
- **Issues:** https://github.com/badmuriss/quikpad/issues
- **Discussões:** https://github.com/badmuriss/quikpad/discussions

---