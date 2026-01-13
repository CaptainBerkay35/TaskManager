# 📋 TaskManager - Proje ve Görev Yönetim Sistemi

Modern ve kullanıcı dostu bir full-stack proje ve görev yönetim uygulaması. Hiyerarşik proje-görev-alt görev yapısı, kategori yönetimi ve kapsamlı takvim görünümü ile profesyonel iş takibi sağlar.

🔗 **Live Demo:** [[https://taskmanager-frontend-xxxx.vercel.app](https://taskmanager-frontend-xxxx.vercel.app)](https://taskmanager-frontend-phi.vercel.app/)

🔗 **Backend API:** [https://taskmanager-api-fl66.onrender.com](https://taskmanager-api-fl66.onrender.com)

🔗 **Swagger Documentation:** [https://taskmanager-api-fl66.onrender.com/swagger](https://taskmanager-api-fl66.onrender.com/swagger)

---

## 🎯 Proje Amacı

TaskManager, bireysel kullanıcılar ve küçük ekipler için tasarlanmış modern bir görev yönetim platformudur. Kullanıcıların projelerini organize etmesini, görevleri takip etmesini ve deadline'ları yönetmesini kolaylaştırır.

### 🌟 Temel Özellikler

- ✅ **Hiyerarşik Yapı:** Proje → Görev → Alt Görev üç katmanlı organizasyon
- 📊 **Dashboard:** Görev durumları, öncelikler ve deadline'lar için görsel raporlama
- 🗂️ **Kategori Yönetimi:** Çoklu kategori desteği ile esnek organizasyon
- 📅 **Takvim Entegrasyonu:** React Big Calendar ile görev ve proje deadline görünümü
- 🔔 **Cascade Deadline Yönetimi:** Alt görev ve görev deadline'ları otomatik proje sınırları içinde
- 🎨 **Modern UI/UX:** Tailwind CSS ile responsive ve kullanıcı dostu arayüz
- 🌙 **Dark Mode:** Göz yormayan karanlık tema desteği
- 🔐 **JWT Authentication:** Güvenli kullanıcı kimlik doğrulama
- 🌍 **Türkçe Lokalizasyon:** Tam Türkçe arayüz ve mesajlar

---

## 🛠️ Teknolojiler

### Backend
- **Framework:** .NET 8.0 Web API
- **ORM:** Entity Framework Core 9.0
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT (JSON Web Tokens)
- **Architecture:** RESTful API, Repository Pattern
- **Validation:** FluentValidation, Data Annotations
- **Password Hashing:** BCrypt.Net

### Frontend
- **Framework:** React 19.1.1
- **Styling:** Tailwind CSS 3.x
- **HTTP Client:** Axios
- **Routing:** React Router DOM v6
- **State Management:** React Context API, Custom Hooks
- **Calendar:** React Big Calendar
- **Build Tool:** Create React App
- **Icons:** Lucide React

### DevOps & Deployment
- **CI/CD:** GitHub Actions
- **Hosting:** 
  - Backend: Render (Docker)
  - Database: Supabase (PostgreSQL)
  - Frontend: Vercel
- **Version Control:** Git, GitHub
- **Containerization:** Docker

---

## 📁 Proje Yapısı
```
TaskManager/
├── TaskManager.API/              # Backend (.NET 8.0 Web API)
│   ├── Controllers/              # API Controllers
│   ├── Data/                     # DbContext, Migrations
│   ├── Models/                   # Entity Models
│   ├── Services/                 # Business Logic (JWT Service)
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Dockerfile                # Docker configuration
│   ├── appsettings.json          # Configuration
│   └── Program.cs                # Application Entry Point
│
├── task-manager-frontend/        # Frontend (React 19.1.1)
│   ├── public/                   # Static Assets
│   │   ├── index.html
│   │   ├── TaskFavIcon.png
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/           # React Components
│   │   │   ├── Auth/             # Login, Register
│   │   │   ├── Calendar/         # Calendar Views
│   │   │   ├── Category/         # Category Management
│   │   │   ├── Dashboard/        # Dashboard & Stats
│   │   │   ├── Project/          # Project Management
│   │   │   └── Task/             # Task & SubTask Management
│   │   ├── context/              # React Context (Auth)
│   │   ├── hooks/                # Custom Hooks
│   │   │   ├── useTaskManager.js
│   │   │   ├── useProjectManager.js
│   │   │   └── useCategoryManager.js
│   │   ├── services/             # API Integration
│   │   │   └── api.js
│   │   ├── constants/            # Constants & Configs
│   │   ├── App.js                # Main App Component
│   │   └── index.js              # React Entry Point
│   ├── .env.production           # Production Environment Variables
│   └── package.json              # Dependencies
│
└── .github/
    └── workflows/                # GitHub Actions CI/CD
        └── deployment.yml        # Auto-deployment configuration
```

---

## 🗄️ Veritabanı Yapısı

### Ana Tablolar

- **Users:** Kullanıcı bilgileri, JWT authentication
- **Categories:** Görev kategorileri (renk kodlu)
- **Projects:** Projeler (deadline, açıklama, renk)
- **Tasks:** Görevler (öncelik, durum, due date)
- **SubTasks:** Alt görevler (checkbox tarzı mikro görevler)
- **ProjectCategories:** Proje-kategori çoklu ilişki

### İlişkiler
```
User (1) ─────→ (N) Projects
User (1) ─────→ (N) Categories
Project (1) ───→ (N) Tasks
Task (1) ──────→ (N) SubTasks
Project (N) ←──→ (N) Categories (ProjectCategories junction table)
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- **Backend:**
  - .NET 8.0 SDK
  - PostgreSQL (veya Supabase hesabı)
  - Visual Studio 2022 veya VS Code

- **Frontend:**
  - Node.js 18.x veya üzeri
  - npm 9.x veya üzeri

### Backend Kurulumu
```bash
# 1. Repository'yi klonlayın
git clone https://github.com/CaptainBerkay35/TaskManager.git
cd TaskManager/TaskManager.API

# 2. Bağımlılıkları yükleyin
dotnet restore

# 3. appsettings.json'da connection string'i güncelleyin
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=taskmanager;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_MIN_32_CHARACTERS",
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerClient"
  }
}

# 4. Database migration'ı çalıştırın
dotnet ef migrations add InitialCreate
dotnet ef database update

# 5. Uygulamayı başlatın
dotnet run
```

Backend varsayılan olarak `https://localhost:7112` adresinde çalışacaktır.

### Frontend Kurulumu
```bash
# 1. Frontend klasörüne gidin
cd task-manager-frontend

# 2. Bağımlılıkları yükleyin
npm install

# 3. .env.local dosyası oluşturun
REACT_APP_API_URL=https://localhost:7112/api

# 4. Uygulamayı başlatın
npm start
```

Frontend varsayılan olarak `http://localhost:3000` adresinde açılacaktır.

---

## 🌐 Production Deployment

### Backend (Render)

1. **Render hesabı oluşturun:** [render.com](https://render.com)
2. **New Web Service** → GitHub repository'nizi bağlayın
3. **Settings:**
   - Runtime: Docker
   - Root Directory: `TaskManager.API`
4. **Environment Variables:**
```
   ConnectionStrings__DefaultConnection=Host=your-supabase-host;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require
   Jwt__Key=YOUR_SECRET_KEY
   Jwt__Issuer=TaskManagerAPI
   Jwt__Audience=TaskManagerClient
   ASPNETCORE_ENVIRONMENT=Production
```

### Database (Supabase)

1. **Supabase hesabı oluşturun:** [supabase.com](https://supabase.com)
2. **Yeni proje oluşturun**
3. **Connection string'i alın** (Session Pooler)
4. Render'da environment variables'a ekleyin

### Frontend (Vercel)

1. **Vercel hesabı oluşturun:** [vercel.com](https://vercel.com)
2. **Import Project** → GitHub repository
3. **Settings:**
   - Framework Preset: Create React App
   - Root Directory: `task-manager-frontend`
4. **Environment Variables:**
```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 🔧 Docker ile Çalıştırma

### Backend Docker
```bash
cd TaskManager.API

# Docker image oluştur
docker build -t taskmanager-api .

# Container'ı çalıştır
docker run -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="YOUR_CONNECTION_STRING" \
  -e Jwt__Key="YOUR_JWT_KEY" \
  taskmanager-api
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Projects
- `GET /api/projects` - Tüm projeleri listele
- `POST /api/projects` - Yeni proje oluştur
- `PUT /api/projects/{id}` - Proje güncelle
- `DELETE /api/projects/{id}` - Proje sil

### Tasks
- `GET /api/tasks` - Görevleri listele
- `POST /api/tasks` - Yeni görev oluştur
- `PUT /api/tasks/{id}` - Görev güncelle
- `DELETE /api/tasks/{id}` - Görev sil

### Categories
- `GET /api/categories` - Kategorileri listele
- `POST /api/categories` - Yeni kategori oluştur
- `PUT /api/categories/{id}` - Kategori güncelle
- `DELETE /api/categories/{id}` - Kategori sil

Tüm endpoint'ler için detaylı dokümantasyon: [Swagger UI](https://taskmanager-api-fl66.onrender.com/swagger)

---

## 🔐 Güvenlik

- ✅ JWT Token tabanlı authentication
- ✅ BCrypt ile şifre hashleme
- ✅ HTTPS/SSL zorunlu (production)
- ✅ CORS politikaları
- ✅ SQL Injection koruması (EF Core)
- ✅ XSS koruması

---

## 🎨 Ekran Görüntüleri

> TODO: Ekran görüntüleri eklenecek

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## 👤 Geliştirici

**Berkay Kaptan**

- GitHub: [@CaptainBerkay35](https://github.com/CaptainBerkay35)

---

## 🙏 Teşekkürler

- [.NET](https://dotnet.microsoft.com/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Render](https://render.com/)
- [Vercel](https://vercel.com/)

---

## 📝 Changelog

### v2.0.0 (2025-11-15)
- ✅ Azure'dan Render+Supabase+Vercel'e migration
- ✅ MSSQL'den PostgreSQL'e geçiş
- ✅ Docker containerization
- ✅ Tamamen ücretsiz hosting altyapısı

### v1.0.0 (Initial Release)
- ✅ İlk production deployment (Azure)
- ✅ Temel CRUD operasyonları
- ✅ JWT Authentication
- ✅ Dashboard ve Calendar görünümü
