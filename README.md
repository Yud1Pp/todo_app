# Taskflow - Aplikasi Todo Full Stack

Aplikasi web todo list full stack yang dibangun untuk Industrix Full Stack Engineer Intern Coding Challenge.

## Gambaran Umum

Aplikasi ini menampilkan keterampilan pengembangan full stack dengan menggunakan:
- **Frontend**: React 19 + TypeScript + Vite + Ant Design
- **Backend**: Go + Gin + GORM
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Fitur yang Diimplementasikan

### Fitur Inti (45 poin)
- [x] Create, Read, Update, Delete (CRUD) untuk todos
- [x] Menandai todos sebagai selesai/belum selesai
- [x] Kategori todo dengan warna kustom
- [x] Pagination dasar (6 item per halaman)
- [x] Mencari todos berdasarkan judul

### Fitur Bonus
- [x] **Backend Unit Tests** (+10 poin) - Tes komprehensif untuk todo dan category services
- [x] **Frontend Unit Tests** (+5 poin) - Tes dengan Vitest untuk API, Context, dan komponen
- [x] **React Context API** (+6 poin) - Implementasi state management lengkap
- [x] **Advanced Filtering** (+5 poin) - Filter berdasarkan status, kategori, priority
- [x] **Docker** (+3 poin) - Backend, frontend, dan database dalam container
- [x] **TypeScript** (+2 poin) - Implementasi TypeScript penuh di frontend

## Cara Menjalankan

### Prasyarat
- Docker Desktop untuk Windows
- Git

### Opsi 1: Menjalankan dengan Docker (Disarankan)

```powershell
# Clone repository dan masuk ke direktori project
cd todo_app

# Mulai semua layanan (PostgreSQL, Backend, Frontend)
docker-compose up --build
```

Layanan akan tersedia di:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **PostgreSQL**: localhost:5432

### Opsi 2: Menjalankan Lokal (Tanpa Docker)

#### Prerequisites
- Go 1.26+
- Node.js 20+
- PostgreSQL 15+

#### Langkah 1: Setup Database PostgreSQL

**Windows (menggunakan pgAdmin atau command line):**
```powershell
# Buat database
createdb -U postgres todo_app

# Atau dengan psql
psql -U postgres -c "CREATE DATABASE todo_app;"
```

**Untuk koneksi lokal, update file `backend/.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo_app
PORT=8080
```

#### Langkah 2: Jalankan Backend

```powershell
cd backend

# Install dependencies
go mod download

# Jalankan server
go run cmd/api/main.go
```

Backend akan berjalan di: http://localhost:8080

#### Langkah 3: Jalankan Frontend

```powershell
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: http://localhost:5173

> **Catatan**: Pastikan PostgreSQL sudah running sebelum menjalankan backend.

## Menjalankan Tes

### Backend Unit Tests
```powershell
cd backend

# Jalankan semua tes
go test ./internal/services/... -v

# Jalankan file tes tertentu
go test ./internal/services/todo_service_test.go -v
```

Backend mencakup 25+ unit tes yang mencakup:
- Operasi CRUD Todo
- Operasi CRUD Category
- Validasi (judul wajib diisi, validasi priority)
- Error handling (tidak ditemukan, ID tidak valid)
- Filter dan fungsi pencarian

### Frontend Tests (Unit Tests)
```powershell
cd frontend

# Jalankan unit tests (single run)
npm run test:run

# Jalankan unit tests (watch mode)
npm test
```

**Frontend mencakup 33+ unit tes yang mencakup:**
- API functions (getTodos, createTodo, updateTodo, deleteTodo, dll.)
- Context state management (fetch, create, update, delete, toggle, filters)
- Komponen TodoItem (rendering, checkbox, priority, completed state)

**Test Files:**
- `src/services/api.test.ts` - API service tests
- `src/context/TodoContext.test.tsx` - Context provider tests
- `src/components/Todo/TodoItem.test.tsx` - Component tests

**Frontend Lint:**
```powershell
cd frontend
npm run lint
```

## Dokumentasi API

### Base URL
```
http://localhost:8080/api
```

### Endpoint Todos

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/todos` | List todos dengan pagination & filters |
| POST | `/todos` | Buat todo baru |
| GET | `/todos/:id` | Ambil todo spesifik |
| PUT | `/todos/:id` | Update todo |
| DELETE | `/todos/:id` | Hapus todo |
| PATCH | `/todos/:id/complete` | Toggle status selesai |

#### Parameter Query GET /todos
| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| page | int | Nomor halaman (default: 1) |
| limit | int | Item per halaman (default: 6) |
| search | string | Cari berdasarkan judul |
| filterBy | string | Tipe filter: completed, category_id, priority |
| filterValue | string | Nilai filter |

#### Format Response
```json
{
  "data": [
    {
      "id": 1,
      "title": "Complete coding challenge",
      "description": "Build a full-stack todo application",
      "completed": false,
      "category_id": 1,
      "category": {
        "id": 1,
        "name": "Work",
        "color": "#3B82F6"
      },
      "priority": "high",
      "due_date": "2026-05-20T23:59:59Z",
      "created_at": "2026-05-17T12:38:27Z",
      "updated_at": "2026-05-17T12:38:27Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 6,
    "total": 5,
    "total_pages": 1
  }
}
```

### Endpoint Categories

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/categories` | List semua categories |
| POST | `/categories` | Buat category baru |
| GET | `/categories/:id` | Ambil category spesifik |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Hapus category |

#### Request POST /categories
```json
{
  "name": "New Category",
  "color": "#FF5722"
}
```

---

## Pertanyaan Teknis

### Pertanyaan Desain Database

#### 1. Tabel database apa yang dibuat dan mengapa?

Saya membuat dua tabel dengan hubungan one-to-many:

**tabel categories**
- `id` (SERIAL PRIMARY KEY) - Identifier unik
- `name` (VARCHAR) - Nama kategori
- `color` (VARCHAR) - Kode warna hex untuk tampilan UI
- `created_at` (TIMESTAMP) - Untuk audit trail

**tabel todos**
- `id` (SERIAL PRIMARY KEY) - Identifier unik
- `title` (VARCHAR, NOT NULL) - Judul todo (wajib diisi)
- `description` (TEXT) - Deskripsi opsional
- `completed` (BOOLEAN) - Status penyelesaian
- `category_id` (INTEGER, FK) - Menghubungi ke tabel categories
- `priority` (VARCHAR) - high/medium/low
- `due_date` (TIMESTAMP) - Tanggal jatuh tempo opsional
- `created_at`, `updated_at` (TIMESTAMP) - Field audit

Hubungan: Satu kategori bisa memiliki banyak todos (1:N). Penghapusan kategori mengatur todo's category_id ke NULL (ON DELETE SET NULL) untuk menjaga data todo.

#### 2. Bagaimana cara menangani pagination dan filtering di database?

**Pagination:**
- Menggunakan GORM's `Limit()` dan `Offset()` methods
- Offset dihitung: `(page - 1) * limit`
- Mengembalikan total count untuk UI pagination frontend

**Filtering:**
- Pencarian: `WHERE title ILIKE '%search%'` (case-insensitive)
- Status selesai: `WHERE completed = true/false`
- Kategori: `WHERE category_id = ?`
- Priority: `WHERE priority = ?`

**Indeks yang ditambahkan:**
```sql
CREATE INDEX idx_todos_category_id ON todos(category_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

Indeks ini meningkatkan performa query untuk operasi filtering dan sorting.

---

### Pertanyaan Keputusan Teknis

#### 1. Bagaimana cara mengimplementasikan responsive design?

**Breakpoints yang digunakan:**
- Mobile: < 576px
- Tablet: 576px - 991px
- Desktop: >= 992px

**Komponen Ant Design:**
- `Layout` - Container utama dengan padding responsif
- `Tabs` - Navigasi tab yang menumpuk di mobile
- `Table` / `List` - Tampilan data responsif
- `Button` - Ukuran adaptif
- `Input` - Input dengan lebar fleksibel

**Pendekatan CSS:**
- Menggunakan CSS custom properties untuk theming
- Media queries untuk layout per breakpoint
- Flexbox/Grid untuk layout fleksibel
- Lebar berbasis persentase dengan max-width

Contoh dari Home.tsx:
```css
@media (min-width: 992px) {
  .toolbar-top {
    flex-direction: row;
    justify-content: space-between;
  }
}
```

#### 2. Bagaimana cara menyusun komponen React?

**Hierarki Komponen:**
```
App.tsx
├── TodoProvider (Context)
└── Home.tsx
    ├── SearchBar.tsx
    ├── FilterBar.tsx
    ├── TodoList.tsx
    │   └── TodoItem.tsx
    ├── TodoForm.tsx (Modal)
    └── CategoryList.tsx
        └── CategoryForm.tsx
```

**State Management:**
- React Context API (`TodoContext.tsx`) untuk state global
- State meliputi: todos, categories, pagination, filters, loading, error
- Actions: fetchTodos, createTodo, updateTodo, deleteTodo, toggleComplete
- Category actions: fetchCategories, createCategory, updateCategory, deleteCategory

**Filtering dan Pagination:**
- State pagination dikelola di Context dengan objek `pagination`
- Filter disimpan di state object `filters`
- Panggilan API menyertakan parameter page, limit, dan filter
- Komponen UI memicu context actions untuk update state

#### 3. Arsitektur backend apa yang dipilih dan mengapa?

**Arsitektur Berlapis:**

```
cmd/api/main.go          - Entry point, setup DI
internal/handlers/       - Layer HTTP, handling request/response
internal/services/       - Layer business logic
internal/repository/    - Layer data access
internal/models/         - Data models
internal/config/         - Konfigurasi
internal/middleware/    - CORS, dll.
```

**Mengapa struktur ini:**
- **Separation of concerns** - Setiap layer punya tanggung jawab spesifik
- **Testability** - Services dapat diuji dengan mock repositories
- **Maintainability** - Mudah menemukan dan mengubah kode
- **Scalability** - Batas bersih memungkinkan evolusi layer independen

**API Routes:**
- Konvensi RESTful dengan HTTP verbs yang tepat
- Dikelompokkan di bawah prefix `/api`
- Berbasis resource: `/todos`, `/categories`
- Actions: `PATCH /todos/:id/complete`

**Error Handling:**
- Try-catch di handlers dengan response error JSON
- Validasi di services (judul wajib, priority valid)
- Error database disampaikan ke atas dengan pesan bermakna

#### 4. Bagaimana cara menangani validasi data?

**Backend (Go):**
- Handler menggunakan `gin.Binding` untuk validasi request
- Field judul ditandai sebagai `binding:"required"`
- Validasi tambahan di service layer:
  - Judul tidak boleh kosong
  - Priority harus: high, medium, atau low (default: medium)
  - Category harus ada saat disediakan
- Pesan error yang tepat dikembalikan sebagai JSON

**Frontend (React):**
- Validasi form menggunakan Ant Design's `Form` component
- Indikator field wajib
- Type checking dengan TypeScript interfaces
- Error handling API dengan try-catch dan feedback pengguna

**Rules Validasi:**
| Field | Aturan |
|-------|--------|
| Title | Wajib, max 255 karakter |
| Description | Opsional, max 1000 karakter |
| Priority | Enum: high, medium, low (default: medium) |
| Category | Opsional, harus ada di database |
| Due Date | Opsional, timestamp valid |

---

### Pertanyaan Testing & Quality

#### 1. Apa yang dipilih untuk diuji dan mengapa?

**Backend Services (fokus utama - 25+ tes):**

| Cakupan Tes | Alasan |
|-------------|--------|
| Todo Create | Fungsi inti, rules validasi |
| Todo Update | Edge cases, partial updates |
| Todo Delete | Penghapusan yang tepat, error handling |
| Todo GetAll | Pagination, filtering, search |
| Todo ToggleComplete | Perubahan state |
| Category CRUD | Paralel dengan todo tests |
| Validation | Judul wajib, enum priority |
| Error cases | Tidak ditemukan, ID tidak valid |

**Struktur Tes:**
- Mock repositories menggunakan testify/mock
- Table-driven tests untuk beberapa skenario
- Assertions komprehensif untuk perilaku yang diharapkan

**Mengapa Tes Backend:**
- Backend berisi sebagian besar business logic
- Operasi database butuh cakupan
- Bonus points untuk backend unit tests (+10)
- Verifikasi critical path

**Frontend Tests:**
- Unit tests menggunakan Vitest + React Testing Library
- Test files: api.test.ts, TodoContext.test.tsx, TodoItem.test.tsx
- 33+ tests covering API, Context, and components
- Lint checking untuk kualitas kode

#### 2. Jika punya lebih banyak waktu, apa yang akan diperbaiki atau ditambahkan?

**Prioritas Perbaikan:**

1. **Integration Tests**
   - End-to-end testing dengan Playwright/Cypress
   - Verifikasi integrasi API

3. **Authentication**
   - JWT-based auth
   - User login/register
   - Protected routes

4. **Fitur Tambahan**
   - Drag-and-drop reordering
   - Pengingat tanggal jatuh tempo
   - Todo berulang
   - Export/Import (CSV, JSON)

5. **Performa**
   - Optimasi query database
   - Memoization frontend
   - Lazy loading untuk list besar

6. **Technical Debt**
   - Error boundary components
   - Loading skeletons daripada spinners
   - Pesan error konsisten di seluruh app

---

## Struktur Project

```
todo_app/
├── backend/
│   ├── cmd/api/main.go          # Entry point
│   ├── internal/
│   │   ├── config/              # Konfigurasi DB
│   │   ├── handlers/            # HTTP handlers
│   │   ├── middleware/          # CORS, dll.
│   │   ├── models/              # GORM models
│   │   ├── repository/          # Data access
│   │   └── services/            # Business logic
│   ├── migrations/             # SQL migrations
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/          # Komponen React
│   │   ├── context/             # React Context
│   │   ├── pages/               # Komponen halaman
│   │   ├── services/            # Pemanggilan API
│   │   ├── types/               # Tipe TypeScript
│   │   ├── styles/              # CSS
│   │   └── test/                # Test setup
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml           # File compose root
├── README.md
└── AGENTS.md
```

---

## Screenshots

Fitur aplikasi:
- UI bersih dan modern dengan branding gradient
- Layout dua tab: Tasks dan Categories
- Todo list dengan indikator priority (merah/kuning/hijau)
- Fungsi pencarian dan filter
- Modal forms untuk membuat/mengedit todos
- Responsive design untuk desktop, tablet, dan mobile

---

## Kesimpulan

Project ini mengimplementasikan semua persyaratan inti plus sebagian besar fitur bonus:
- **Skor Dasar**: ~100 poin (semua fitur inti berfungsi)
- **Poin Bonus**: +28 (backend tests + frontend tests, context, filtering, docker, typescript)
- **Total Estimasi**: 118-128 poin

Aplikasi siap produksi dengan struktur kode yang bersih, error handling yang tepat, dan dokumentasi komprehensif.