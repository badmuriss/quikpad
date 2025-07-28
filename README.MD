# Quikpad

A set of minimalist and fast web tools for productivity, built with a focus on simplicity and low cost.

## 🌐 Access Online

- **🏠 Quikpad:** [quikpad.cc](https://quikpad.cc)
- **📝 QuikNote:** [quiknote.cc](https://quiknote.cc)
- **💻 QuikCode:** [quikcode.cc](https://quikcode.cc)

## 📋 About the Project

**Quikpad** consists of three main applications:

- **🏠 Quikpad** - Central portal that aggregates and redirects to other tools
- **📝 QuikNote** - Rich-text editor (basic Notion-style) with Markdown and PDF export
- **💻 QuikCode** - Lightweight code editor with syntax highlighting, themes, and text/image export

### ✨ Features

- **Monorepo** with pnpm workspaces + Turborepo
- **TypeScript** across the entire stack
- **Client-Side Rendering** (React + Vite)
- **Low cost** hosting and maintenance

## 🏗️ Architecture

```
/apps/hub       # Quikpad Portal (React + Vite)
/apps/note      # Notes Editor (React + Vite + TipTap)
/apps/code      # Code Editor (React + Vite + Prism Editor)
/packages/ui    # Shared components (Tailwind CSS)
/packages/api   # API types and client
/backend        # Express.js API + TypeScript + MongoDB
```

### 🛠️ Tech Stack

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

## 🚀 Local Development

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/badmuriss/quikpad.git
cd quikpad

# Install dependencies
pnpm install

# Run development environment
pnpm run dev
```

### 🌐 Development URLs

After running `pnpm run dev`, applications will be available at:

- **Hub:** http://localhost:5173
- **Note:** http://localhost:6001  
- **Code:** http://localhost:6002
- **Backend API:** http://localhost:3001

### ⚙️ Environment Variables

Applications work with default configurations, but you can customize by creating `.env` files in each app's root folder:

**Backend (`/backend/.env`):**
```env
MONGO_URI=mongodb://localhost:27017/quikpad
MONGO_DB=quikpad
NOTES_COLLECTION=quikNotes
CODES_COLLECTION=quikCodes
NODE_ENV=development
```

**Frontend Apps (`/apps/hub/.env`, `/apps/note/.env`, `/apps/code/.env`):**
```env
# Hub
VITE_QUIKNOTE_URL=http://localhost:6001
VITE_QUIKCODE_URL=http://localhost:6002

# Note and Code
VITE_API_ENDPOINT=http://localhost:3001
```

## 🤝 How to Contribute

1. **Fork** the project
2. Create a **branch** for your feature (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/new-feature`)
5. Open a **Pull Request**

### 📝 Development Standards

- Use **TypeScript** in all code
- Follow **ESLint** standards

### 🧪 Useful Commands

```bash
# Lint
pnpm run lint

# Production build
pnpm run build

# Run specific app only
pnpm run dev --filter=note
pnpm run dev --filter=code
pnpm run dev --filter=hub
```

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🔗 Links

- **Repository:** https://github.com/badmuriss/quikpad
- **Issues:** https://github.com/badmuriss/quikpad/issues
- **Discussions:** https://github.com/badmuriss/quikpad/discussions

---