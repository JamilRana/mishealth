# MIS Office Portal with CMS — Implementation Plan

## Prompt Review & Recommendations

Your prompt is well-structured and comprehensive. Below is my review with practical adjustments to make this buildable in a realistic, phased manner.

> [!IMPORTANT]
> ### Key Decisions Requiring Your Input
>
> 1. **Database**: You already have a **Neon PostgreSQL** URL in your [.env](file:///d:/mis-portfoilo/.env). Should we use Neon instead of a self-hosted PostgreSQL? *(Recommended: Yes — Neon is production-ready, serverless, and eliminates VPS DB management.)*
> 2. **MinIO / File Storage**: MinIO requires a running server (VPS). For initial development, shall we use **local file storage** (via `/public/uploads`) and abstract it so MinIO can be swapped in later? Or do you already have a MinIO instance?
> 3. **Tailwind CSS Version**: You requested Tailwind CSS — shall we use **Tailwind CSS v4** (latest) or **v3**? shadcn/ui has good support for both.
> 4. **Content**: Should all content be in **English**, or do you need **Bengali (বাংলা)** language support?
> 5. **Scope for Initial Build**: This is a very large system (8+ public pages, 7+ admin modules, 9+ DB models, full CRUD APIs). I recommend building it in **iterative phases** with working checkpoints. Do you agree with this phased approach?

---

## Prompt Strengths ✅

- Clear tech stack specification
- Well-defined page structure and admin modules
- Good database model list
- Security considerations included
- Realistic deployment strategy (Vercel + VPS)

## Prompt Adjustments ⚠️

| Original | Recommended Change | Reason |
|---|---|---|
| PostgreSQL (self-hosted) | **Neon PostgreSQL** (already configured) | You already have a Neon DB; eliminates VPS complexity |
| MinIO file storage | **Local uploads → MinIO abstraction** | Start simple, swap storage provider later |
| All features at once | **Phased delivery** | Ensures each phase is working before moving on |
| NextAuth | **Auth.js v5** (NextAuth v5) | Latest version, better App Router support |
| Recharts for charts | Keep Recharts | Good choice, lightweight |

---

## Proposed Folder Structure

```
d:\mis-portfoilo\
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── uploads/             # Local file storage (dev)
│   └── images/              # Static assets
├── src/
│   ├── app/
│   │   ├── (public)/        # Route group: public pages
│   │   │   ├── page.tsx                    # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── statistics/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   ├── news/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── (admin)/         # Route group: CMS dashboard
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx                # Dashboard
│   │   │       ├── projects/page.tsx
│   │   │       ├── documents/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       ├── news/page.tsx
│   │   │       ├── users/page.tsx
│   │   │       └── messages/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── projects/route.ts
│   │   │   ├── documents/route.ts
│   │   │   ├── reports/route.ts
│   │   │   ├── news/route.ts
│   │   │   ├── messages/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── search/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── public/          # Public site components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── hero-slider.tsx
│   │   │   ├── stats-counter.tsx
│   │   │   └── ...
│   │   └── admin/           # Admin components
│   │       ├── sidebar.tsx
│   │       ├── topbar.tsx
│   │       ├── data-table.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── auth.ts          # Auth.js config
│   │   ├── upload.ts        # File upload abstraction
│   │   ├── utils.ts         # Utilities
│   │   └── validations.ts   # Zod schemas
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript types
├── .env
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── components.json          # shadcn/ui config
```

---

## Proposed Changes — Phased Build

### Phase 1: Project Foundation

#### [NEW] Project initialization
- Initialize Next.js 15 with App Router, TypeScript, Tailwind CSS
- Install and configure shadcn/ui
- Install dependencies: `framer-motion`, `recharts`, `next-auth`, `prisma`, `@prisma/client`, `zod`, `lucide-react`
- Configure `tailwind.config.ts` with custom MIS color palette (government-style: deep blue, green, white)

---

### Phase 2: Base Layout & Navigation

#### [NEW] [layout.tsx](file:///d:/mis-portfoilo/src/app/layout.tsx)
- Root layout with font (Inter/Noto Sans Bengali), theme provider, metadata

#### [NEW] [navbar.tsx](file:///d:/mis-portfoilo/src/components/public/navbar.tsx)
- Sticky responsive navbar with MIS/DGHS branding
- Mobile hamburger menu
- Navigation links to all public pages

#### [NEW] [footer.tsx](file:///d:/mis-portfoilo/src/components/public/footer.tsx)
- Government-style footer with links, contact info, DGHS logos

#### [NEW] Public layout group `(public)/layout.tsx`
- Wraps all public pages with navbar + footer

---

### Phase 3: Public Pages

#### [NEW] Home Page — `(public)/page.tsx`
- Hero slider with Framer Motion transitions
- Animated statistics counters (projects, documents, systems)
- MIS systems showcase cards
- Recent activities, featured projects, latest news sections

#### [NEW] About Page — `(public)/about/page.tsx`
- Mission & vision content
- Organizational structure (could use a simple org chart)
- Animated timeline of MIS milestones

#### [NEW] Projects Page — `(public)/projects/page.tsx` + `[id]/page.tsx`
- Grid layout with filter sidebar (year, category, status)
- Project detail page with description, timeline, images, documents

#### [NEW] Statistics Page — `(public)/statistics/page.tsx`
- Recharts bar/pie/line charts
- Projects by year, category distribution

#### [NEW] Reports Page — `(public)/reports/page.tsx`
- Filterable list with download links

#### [NEW] Documents Page — `(public)/documents/page.tsx`
- Searchable, categorized document library

#### [NEW] News Page — `(public)/news/page.tsx` + `[id]/page.tsx`
- News list with detail view

#### [NEW] Contact Page — `(public)/contact/page.tsx`
- Contact form with Zod validation and API submission

---

### Phase 4: Database & Prisma Schema

#### [NEW] [schema.prisma](file:///d:/mis-portfoilo/prisma/schema.prisma)

Models:
```
User         → id, name, email, password, role (ADMIN/EDITOR), createdAt
Project      → id, title, slug, description, category, status, year, location, startDate, endDate, createdAt
ProjectImage → id, projectId (FK), url, caption
Document     → id, title, category, year, fileUrl, fileType, createdAt
Report       → id, title, category, year, fileUrl, published, createdAt
News         → id, title, slug, content, excerpt, coverImage, published, createdAt
Message      → id, name, email, subject, body, resolved, createdAt
ActivityLog  → id, userId (FK), action, entity, entityId, createdAt
```

#### [NEW] [seed.ts](file:///d:/mis-portfoilo/prisma/seed.ts)
- Seed script with sample data for all models
- Default admin user (email: admin@mis.dghs.gov.bd)

---

### Phase 5: API Routes

#### [NEW] REST API routes under `src/app/api/`
Each route provides:
- `GET` — list with pagination, filtering, search
- `POST` — create (admin-protected)
- `PUT` — update (admin-protected)
- `DELETE` — delete (admin-protected)

Routes: `/api/projects`, `/api/documents`, `/api/reports`, `/api/news`, `/api/messages`, `/api/upload`, `/api/search`

#### [NEW] [validations.ts](file:///d:/mis-portfoilo/src/lib/validations.ts)
- Zod schemas for all form inputs and API payloads

---

### Phase 6: Authentication

#### [NEW] [auth.ts](file:///d:/mis-portfoilo/src/lib/auth.ts)
- Auth.js v5 configuration with Credentials provider
- JWT strategy with role in token
- Password hashing with bcrypt

#### [NEW] [route.ts](file:///d:/mis-portfoilo/src/app/api/auth/%5B...nextauth%5D/route.ts)
- Auth.js route handler

#### [NEW] Middleware — `src/middleware.ts`
- Protect `/admin/*` routes
- Role-based access control

---

### Phase 7: Admin CMS Dashboard

#### [NEW] Admin layout — `(admin)/admin/layout.tsx`
- Sidebar navigation (collapsible)
- Top bar with user info, logout
- Main content panel

#### [NEW] Admin Dashboard — `admin/page.tsx`
- Summary cards: total projects, documents, reports, messages
- Recent activity log
- Quick-action buttons

#### [NEW] Admin CRUD pages
- **Projects**: data table, create/edit modal, image upload
- **Documents**: upload, metadata form, categorize
- **Reports**: upload, publish/unpublish toggle
- **News**: rich text editing (using a markdown editor or simple textarea), publish control
- **Users**: user list, create/edit, role assignment
- **Messages**: inbox view, mark as resolved

#### [NEW] Reusable admin components
- `data-table.tsx` — sortable, paginated table
- `file-upload.tsx` — drag-and-drop file upload
- `confirm-dialog.tsx` — delete confirmation

---

### Phase 8: File Upload

#### [NEW] [upload.ts](file:///d:/mis-portfoilo/src/lib/upload.ts)
- Abstracted file upload service
- Initial implementation: save to `public/uploads/` with unique filenames
- File type & size validation
- Returns URL path for database storage
- Designed to swap to MinIO later (just change the storage adapter)

#### [NEW] `/api/upload/route.ts`
- Handles multipart form data
- Validates files, calls upload service, returns URL

---

### Phase 9: Polish & Optimization

- Framer Motion page transitions, scroll animations, hover effects
- Dark mode toggle (using `next-themes`)
- Image optimization with `next/image`
- Lazy loading for below-fold content
- SEO metadata on all pages
- Loading states and error boundaries

---

## Verification Plan

### Automated Verification

1. **Build check**: `npm run build` — must complete without errors
2. **Lint check**: `npm run lint` — no lint errors
3. **Prisma validation**: `npx prisma validate` — schema is valid
4. **Database migration**: `npx prisma db push` — applies to Neon DB

### Browser Verification (I will do these)

1. **Public pages**: Navigate all 8 public pages, verify layout, responsiveness, content rendering
2. **Admin login**: Log in with seeded admin credentials
3. **Admin CRUD**: Create, edit, delete a project through the admin panel
4. **Contact form**: Submit a contact message and verify it appears in admin inbox
5. **File upload**: Upload a document and verify it's saved and accessible
6. **Dark mode**: Toggle dark mode on public and admin pages
7. **Mobile responsiveness**: Resize browser to mobile viewport and check all pages

### Manual Verification (for you)

1. **Deploy to Vercel**: Push to Git, connect to Vercel, verify production build
2. **MinIO integration** (when ready): Test file uploads with a MinIO instance
3. **Real content**: Replace seed data with actual MIS/DGHS content, logos, and images

---

## Estimated File Count

| Category | Files |
|---|---|
| App pages (public) | ~12 |
| App pages (admin) | ~8 |
| API routes | ~8 |
| Components (public) | ~10 |
| Components (admin) | ~8 |
| Components (ui/shadcn) | ~15 |
| Lib/utils | ~6 |
| Config files | ~6 |
| Prisma | ~2 |
| **Total** | **~75 files** |

> [!WARNING]
> This is a large project. I will build it in phases, ensuring each phase works before moving to the next. The full build will take multiple sessions. Phase 1-3 (foundation + public pages) will be built first, giving you a working public site to preview.
