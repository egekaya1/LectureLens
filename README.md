# LectureLens 🎓

**AI-Powered Study Tool for Students**

LectureLens transforms your lecture recordings and transcripts into comprehensive study materials using AI. Upload your lectures and get instant topic breakdowns, flashcards, practice questions, and intelligent Q&A capabilities.

> **Current Status**: Backend processing complete (Milestone 1.1) | Frontend auth & UI in development

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)

---

## 🚀 Features

### ✅ Currently Implemented

- **Secure Authentication** - User signup/signin with Supabase Auth
- **Lecture Upload** - Upload and store lecture transcripts
- **AI Topic Extraction** - Automatic extraction of 5-8 main topics from lectures using GPT-4o-mini
- **Semantic Chunking** - Intelligent transcript chunking with vector embeddings
- **Row-Level Security** - Full RLS policies for data isolation
- **Processing Pipeline** - Edge function-based lecture processing with status tracking

### 🚧 In Development (Planned Milestones)

#### Milestone 1: Auth UI & Processing Integration (Current)

- [ ] Complete auth UI with sign up/sign in forms
- [ ] Global auth context and protected routes
- [ ] Navigation component with responsive design
- [ ] Landing page with hero and CTAs
- [ ] Processing trigger integration in upload flow
- [ ] Dashboard with lecture status display
- [ ] Topic display in lecture detail views

#### Milestone 2: Lecture Detail Page (Next)

- Topic navigation and exploration
- Inline topic editing
- Lecture management (edit, delete, reprocess)
- Loading states and error handling

#### Milestone 3: Flashcard Generation

- AI-generated flashcards per topic
- Interactive study mode with card-flip UI
- Custom flashcard creation
- Spaced repetition tracking (optional)

#### Milestone 4: Q&A Generation

- Practice questions with step-by-step solutions
- Interactive quiz mode
- AI answer evaluation
- Custom question creation

#### Milestone 5: Semantic Search & RAG

- Semantic search across lectures
- RAG-powered Q&A (ask questions, get grounded answers)
- Search history tracking
- Citation links to source chunks

#### Milestone 6: Study Schedules

- AI-generated personalized study plans
- Calendar view with progress tracking
- Email reminders (optional)
- Study analytics

#### Milestone 7: Production Polish

- Deployment to Vercel
- Error monitoring (Sentry)
- Analytics integration
- Performance optimization
- SEO & onboarding flow

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │ (React, TypeScript, TailwindCSS)
│   Frontend      │
└────────┬────────┘
         │
         ├─── Authentication (Supabase Auth)
         │
         ├─── API Routes (Next.js API)
         │
         ▼
┌─────────────────┐
│   Supabase      │
│   Backend       │
├─────────────────┤
│ • PostgreSQL    │ (Lectures, Topics, Chunks, Users)
│ • Vector Store  │ (pgvector for embeddings)
│ • Edge Funcs    │ (Deno-based processing)
│ • Storage       │ (Future: audio files)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Vercel AI GW    │
├─────────────────┤
│ • GPT-4o-mini   │ (Topic extraction, flashcards, Q&A)
│ • text-emb-3    │ (Semantic search embeddings)
└─────────────────┘
```

### Database Schema

#### Core Tables

- **`lectures`** - User-uploaded lectures with processing status
- **`lecture_chunks`** - Semantically chunked transcript pieces with embeddings
- **`topics`** - AI-extracted main topics from lectures

#### Future Tables (Planned)

- **`flashcards`** - Generated study flashcards per topic
- **`qa_pairs`** - Practice questions with solutions
- **`search_history`** - User Q&A interaction history
- **`study_plans`** - Personalized study schedules
- **`study_sessions`** - Scheduled study blocks

---

## 🛠️ Tech Stack

| Layer         | Technology                                                         |
| ------------- | ------------------------------------------------------------------ |
| **Frontend**  | Next.js 16, React 19, TypeScript, TailwindCSS v4                   |
| **Backend**   | Supabase (PostgreSQL, Auth, Edge Functions)                        |
| **AI/ML**     | OpenAI GPT-4o-mini, text-embedding-3-small (via Vercel AI Gateway) |
| **Vector DB** | pgvector (Supabase extension)                                      |
| **Hosting**   | Vercel (app), Supabase (backend)                                   |
| **Dev Tools** | ESLint, Prettier, Husky, TypeScript                                |

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 20+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Vercel AI Gateway API key ([vercel.com/ai](https://vercel.com/ai))

### 1. Clone Repository

```bash
git clone https://github.com/egekaya1/LectureLens.git
cd LectureLens
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SERVICE_ROLE_KEY=your-service-role-key

# Vercel AI Gateway
AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key
```

**How to get these values:**

- **Supabase**: Project Settings → API in Supabase Dashboard
- **Vercel AI Gateway**: Create API key at [vercel.com/ai](https://vercel.com/ai)

### 4. Set Up Supabase

#### Initialize Supabase

```bash
npx supabase init
npx supabase link --project-ref your-project-ref
```

#### Run Migrations

```bash
npx supabase db push
```

This creates:

- `lectures` table with RLS policies
- `lecture_chunks` table with vector embeddings
- `topics` table
- Necessary indexes and triggers

#### Deploy Edge Function

```bash
npx supabase functions deploy process-lecture
```

Set edge function secrets:

```bash
npx supabase secrets set AI_GATEWAY_API_KEY=your-key
npx supabase secrets set SERVICE_ROLE_KEY=your-service-role-key
npx supabase secrets set NEXT_PUBLIC_SUPABASE_URL=your-url
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Current Features

### 1. Sign Up

Navigate to `/login` and create an account using email/password.

### 2. Upload a Lecture

```bash
# Navigate to /upload
# Enter a title and paste a transcript
# Click "Upload Lecture"
```

### 3. Trigger Processing (Manual - UI coming soon)

```bash
# Get your lecture ID from the database
# Call the edge function manually:
curl -X POST https://your-project.supabase.co/functions/v1/process-lecture \
  -H "Content-Type: application/json" \
  -d '{"lectureId": "your-lecture-id"}'
```

### 4. View Results

Check the database:

```sql
-- View lecture status
SELECT id, title, status, topic_count FROM lectures;

-- View extracted topics
SELECT title, summary FROM topics WHERE lecture_id = 'your-lecture-id';

-- View chunks with embeddings
SELECT chunk_index, content FROM lecture_chunks WHERE lecture_id = 'your-lecture-id';
```

---

## 📁 Project Structure

```
lecturelens/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Landing page (to be updated)
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── globals.css        # Global styles
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/             # Auth page (to be built)
│   │   └── upload/            # Upload page
│   ├── components/            # React components (to be added)
│   │   ├── AuthForm.tsx      # (Planned) Auth UI
│   │   ├── Navbar.tsx        # (Planned) Navigation
│   │   └── TopicList.tsx     # (Planned) Topic display
│   ├── context/               # React context (to be added)
│   │   └── AuthContext.tsx   # (Planned) Global auth state
│   ├── lib/
│   │   └── supabaseClient.ts # Supabase client initialization
│   └── types/
│       └── supabase.ts        # Generated TypeScript types
├── supabase/
│   ├── functions/
│   │   └── process-lecture/   # Edge function for AI processing
│   │       ├── index.ts       # Main processing logic
│   │       └── deno.json      # Deno config
│   ├── migrations/            # Database migrations
│   │   ├── *_init_tables.sql
│   │   ├── *_add_user_id_to_lectures.sql
│   │   ├── *_add_processing_fields.sql
│   │   ├── *_create_lecture_chunks.sql
│   │   ├── *_create_topics.sql
│   │   └── *_add_lectures_rls_policies.sql
│   └── config.toml            # Supabase config
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🔒 Security Features

### Row-Level Security (RLS)

All tables have RLS enabled with policies ensuring:

- Users can only access their own data
- Service role (edge functions) has full access
- Automatic `user_id` filtering on SELECT queries

### Authentication

- Supabase Auth handles secure password hashing
- JWT-based session management
- Protected routes via middleware (to be implemented)

### Environment Variables

- Service role keys never exposed to client
- API keys stored in Supabase secrets for edge functions

---

## 🗺️ Development Roadmap

### Timeline: 2-3 months (part-time)

| Milestone                 | Duration    | Status                    |
| ------------------------- | ----------- | ------------------------- |
| M1: Auth UI & Processing  | 1.5-2 weeks | 🟡 In Progress (15% done) |
| M2: Lecture Detail Pages  | 1-1.5 weeks | ⚪ Not Started            |
| M3: Flashcard Generation  | 1.5-2 weeks | ⚪ Not Started            |
| M4: Q&A Generation        | 1.5-2 weeks | ⚪ Not Started            |
| M5: Semantic Search & RAG | 2-2.5 weeks | ⚪ Not Started            |
| M6: Study Schedules       | 1-1.5 weeks | ⚪ Not Started            |
| M7: Polish & Deploy       | 1.5-2 weeks | ⚪ Not Started            |

**Total Estimated Effort**: 74-104 hours

See [Development Plan](#-development-plan) below for detailed task breakdown.

---

## 🎯 Development Plan

<details>
<summary><b>Milestone 1: Auth UI & Processing Integration (CURRENT)</b></summary>

**Goal**: Enable complete user flow from signup → upload → view topics

### Tasks

- [x] 1.1 Codify RLS Migration ✅ DONE
- [ ] 1.2 Build Complete Auth UI (3-4 hours)
  - Sign up/sign in forms with validation
  - Password reset flow
  - Error handling
- [ ] 1.3 Create Global Auth Context (1-2 hours)
  - `AuthProvider` component
  - `useAuth()` hook
  - Session persistence
- [ ] 1.4 Build Navigation Component (1-2 hours)
  - Responsive navbar
  - Protected route links
  - Sign out functionality
- [ ] 1.5 Replace Home Page with Landing (1 hour)
  - Hero section
  - Feature showcase
  - CTA buttons
- [ ] 1.6 Add Processing Trigger to Upload Flow (2-3 hours) ⭐
  - Title input field
  - Edge function integration
  - Status feedback
- [ ] 1.7 Display Topics in Dashboard (2-3 hours) ⭐
  - Lecture cards with status badges
  - Topic previews
  - Expandable topic lists
- [ ] 1.8 Add Route Protection Middleware (30 min)
  - Protected route redirects
  - Auth state checking

**Acceptance Criteria**: Users can sign up, upload lectures, trigger processing, and view extracted topics in dashboard.

</details>

<details>
<summary><b>Milestones 2-7: Feature Development</b></summary>

Full task breakdowns available in the comprehensive development plan document. Key features:

- **M2**: Lecture detail pages with topic navigation
- **M3**: AI flashcard generation + study mode
- **M4**: Practice questions with quiz interface
- **M5**: Semantic search + RAG Q&A
- **M6**: Study schedule generation
- **M7**: Production deployment + monitoring

</details>

---

## 🤝 Contributing

This is currently a portfolio project. Contributions, issues, and feature requests are welcome!

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Run `npm run format` before committing (Prettier)
- Run `npm run lint` to check for issues (ESLint)
- Husky pre-commit hooks enforce formatting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** - GPT-4o-mini and text-embedding-3-small models
- **Supabase** - Backend infrastructure and edge functions
- **Vercel** - AI Gateway and Next.js hosting
- **pgvector** - Vector similarity search in PostgreSQL

---

## 📧 Contact

**Ege Kaya** - [@egekaya1](https://github.com/egekaya1)

**Project Repository**: [https://github.com/egekaya1/LectureLens](https://github.com/egekaya1/LectureLens)

---

## 🐛 Known Issues

- [ ] Auth UI not yet implemented (manual auth via Supabase dashboard)
- [ ] Processing must be triggered manually via curl (UI integration pending)
- [ ] No error handling for failed processing in UI
- [ ] Dashboard shows raw data (needs styled components)

Track all issues on [GitHub Issues](https://github.com/egekaya1/LectureLens/issues).

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [pgvector Guide](https://github.com/pgvector/pgvector)
- [TailwindCSS v4 Docs](https://tailwindcss.com/docs)

---

**Built with ❤️ for students everywhere**
