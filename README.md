# OpenCity AI Hub 🏙️

A modern AI-powered municipal management platform built with Next.js and FastAPI, designed to help cities leverage AI for waste management, CCTV monitoring, industrial data exchange, and municipal analytics.

## 🚀 Features

- **AI Chat Interface**: Interactive chat with AI models for city management queries
- **Waste Classifier**: AI-powered waste classification and management system
- **CCTV Audit**: Real-time CCTV monitoring and audit capabilities
- **Industrial Exchange**: Platform for industrial data sharing and collaboration
- **Municipal Insights**: Analytics dashboard for city-wide data visualization
- **AI Model Gallery**: Browse and explore available AI models
- **Theme Customization**: Dark/light mode with customizable themes
- **Multi-language Support**: Internationalization support

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Package Manager**: pnpm

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Database Migrations**: Alembic
- **Task Queue**: Celery
- **AI Integration**: Hugging Face & Mistral AI clients
- **Authentication**: JWT-based authentication
- **Configuration**: Pydantic settings

## 📁 Project Structure

```
opencity-ai-hub/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── pages/             # Page-level components
│   └── ui/                # Reusable UI components
├── contexts/              # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
├── styles/                # Global styles
├── backend/               # Python FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Core configuration
│   │   ├── db/           # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # External service clients
│   │   └── tasks/        # Celery tasks
│   ├── migrations/        # Alembic migrations
│   └── scripts/          # Utility scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.9+
- PostgreSQL (for production)
- Redis (for Celery tasks)

### Frontend Setup

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## 🔧 Configuration

### Frontend Configuration

- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

### Backend Configuration

- `backend/app/core/config.py`: Application settings
- `backend/alembic.ini`: Database migration configuration
- `backend/.env`: Environment variables (create from `.env.example`)

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

For detailed API documentation, see [backend/API_REFERENCE.md](backend/API_REFERENCE.md).

## 🎨 Customization

The application supports extensive theming through the Theme Customizer:
- Primary/Secondary/Accent colors
- Border radius
- Font family
- Dark/Light mode

## 🧪 Testing

### Frontend Tests
```bash
pnpm test
```

### Backend Tests
```bash
cd backend
pytest
```

## 📦 Building for Production

### Frontend
```bash
pnpm build
pnpm start
```

### Backend
See [backend/IMPLEMENTATION_GUIDE.md](backend/IMPLEMENTATION_GUIDE.md) for deployment instructions.

## 🐳 Docker Support

Docker configuration is available in the backend:
```bash
cd backend
docker-compose up
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Radix UI for accessible component primitives
- shadcn/ui for component inspiration
- Vercel for Next.js
- FastAPI team for the amazing framework

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ for smarter cities
