# 📋 TaskManager - Proje ve Görev Yönetim Sistemi

Modern ve kullanıcı dostu bir full-stack proje ve görev yönetim uygulaması. Hiyerarşik proje-görev-alt görev yapısı, kategori yönetimi ve kapsamlı takvim görünümü ile profesyonel iş takibi sağlar.

🔗 **Live Demo:** [https://proud-pond-03090d903.1.azurestaticapps.net]([https://proud-pond-03090d903.1.azurestaticapps.net](https://taskmanager-frontend-phi.vercel.app/))

🔗 **Backend API:** [https://taskmanager-board-ffcph5e0fecveme4.germanywestcentral-01.azurewebsites.net/swagger](https://taskmanager-board-ffcph5e0fecveme4.germanywestcentral-01.azurewebsites.net/swagger)

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
- **ORM:** Entity Framework Core 8.0
- **Database:** Azure SQL Server
- **Authentication:** JWT (JSON Web Tokens)
- **Architecture:** RESTful API, Repository Pattern
- **Validation:** FluentValidation, Data Annotations

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
  - Backend: Azure App Service (Windows)
  - Frontend: Azure Static Web Apps
- **Version Control:** Git, GitHub

---

## 📁 Proje YapısıTaskManager/
├── TaskManager.API/              # Backend (.NET 8.0 Web API)
│   ├── Controllers/              # API Controllers
│   ├── Data/                     # DbContext, Migrations
│   ├── Models/                   # Entity Models
│   ├── Services/                 # Business Logic (JWT Service)
│   ├── DTOs/                     # Data Transfer Objects
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
├── master_taskmanager-board.yml              # Backend Deployment
└── azure-static-web-apps-frontend.yml        # Frontend Deployment---

## 🗄️ Veritabanı Yapısı

### Ana Tablolar

- **Users:** Kullanıcı bilgileri, JWT authentication
- **Categories:** Görev kategorileri (renk kodlu)
- **Projects:** Projeler (deadline, açıklama, renk)
- **Tasks:** Görevler (öncelik, durum, due date)
- **SubTasks:** Alt görevler (checkbox tarzı mikro görevler)
- **ProjectCategories:** Proje-kategori çoklu ilişki

### İlişkiler
User (1) ─────→ (N) Projects
User (1) ─────→ (N) Categories
Project (1) ───→ (N) Tasks
Task (1) ──────→ (N) SubTasks
Project (N) ←──→ (N) Categories (ProjectCategories junction table)
---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- **Backend:**
  - .NET 8.0 SDK
  - SQL Server / Azure SQL Database
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
    "DefaultConnection": "YOUR_SQL_CONNECTION_STRING"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY",
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerClient"
  }
}

# 4. Database migration'ı çalıştırın
dotnet ef database update

# 5. Uygulamayı başlatın
dotnet run
Backend varsayılan olarak https://localhost:7112 adresinde çalışacaktır.

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
Frontend varsayılan olarak http://localhost:3000 adresinde açılacaktır.
