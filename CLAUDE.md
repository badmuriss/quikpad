# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Root-level commands (using Turborepo + pnpm):**
- `pnpm run dev` - Start all applications in development mode
- `pnpm run build` - Build all applications for production
- `pnpm run lint` - Lint all applications

**Individual app development:**
- `pnpm run dev --filter=note` - Run only QuikNote app (port 6001)
- `pnpm run dev --filter=code` - Run only QuikCode app (port 6002)
- `pnpm run dev --filter=hub` - Run only Hub app (port 5173)

**Backend:**
- `cd backend && npm run dev` - Start backend with MongoDB (port 3001)
- `cd backend && npm run build` - Build backend TypeScript

**Docker (full stack):**
- `npm run docker:build` - Build all Docker containers
- `npm run docker:up` - Start all services via Docker Compose
- `npm run deploy` - Build and start all services

## Architecture Overview

**Monorepo Structure:**
- **pnpm workspaces** + **Turborepo** for orchestration
- **TypeScript** across all applications
- **React 19 + Vite** for all frontend apps
- **Express.js + MongoDB** for backend

**Applications:**
- `/apps/hub` - Landing page that links to other tools (quikpad.cc)
- `/apps/note` - Rich text editor using TipTap v3 (quiknote.cc)
- `/apps/code` - Code editor using prism-react-editor (quikcode.cc)
- `/backend` - REST API server handling notes and code storage

**Key Technical Details:**

**Frontend Apps:**
- All use **Tailwind CSS** for styling (v4.x with @tailwindcss/vite plugin)
- **React Router v7** for routing (note app uses dynamic routes /:id)
- **Debounced auto-save** functionality in note and code editors
- **Theme system** with dark/light mode support
- **Export capabilities** (PDF, image, text formats)

**TipTap Editor (QuikNote):**
- Custom TipTap setup with extensive extensions in `/@/components/tiptap-*`
- Modular UI components in `/@/components/tiptap-ui/` and `/@/components/tiptap-ui-primitive/`
- SCSS styling for editor components
- Font family and size controls, text alignment, lists, links, highlights

**Code Editor (QuikCode):**
- Uses `prism-react-editor` for syntax highlighting
- Language detection and selection
- Export to image/text formats
- GitHub-style themes (light/dark)

**Backend API:**
- Routes: `/notes/:id` and `/codes/:id` (GET, PUT, POST)
- CORS configured for production domains and localhost
- MongoDB collections: `quikNotes` and `quikCodes`
- Environment variables for database configuration

**Development URLs:**
- Hub: http://localhost:5173
- Note: http://localhost:6001  
- Code: http://localhost:6002
- Backend: http://localhost:3001

**Shared Patterns:**
- All apps use **nanoid** for unique ID generation
- Auto-save with **debounce** (2s delay)
- URL-based document loading (/:id routes)
- Consistent theme toggle implementation
- Share functionality with export options