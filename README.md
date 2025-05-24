# Personal Health Records Manager (PHRM)

A secure web-based application for managing personal and family health records with AI-powered insights and ultra-modern UI/UX.

## Project Overview

PHRM helps individuals securely store, organize, and access health records for themselves and their family members. The application includes an AI-powered assistant that provides personalized health advice, reminders, and guidance based on stored medical data.

## Key Features

- User and family member profile management
- Comprehensive health records storage and organization
- AI health assistant with personalized insights
- Medication and appointment reminders
- Health data visualization
- End-to-end encryption and privacy controls

## Technical Stack

### Backend
- FastAPI framework with async support
- SQLite for development, PostgreSQL for production
- SQLAlchemy ORM with Pydantic for validation
- JWT authentication with secure password handling

### Frontend
- React with TypeScript and Vite
- Material-UI (MUI) for ultra-modern interface
- Redux Toolkit for state management
- Chart.js for data visualization

## Development Philosophy

The PHRM application is developed with the following principles:

1. **Start Minimal, Expand Incrementally**: Begin with core functionality that works flawlessly, then add features one by one
2. **Modular Architecture**: Highly modularized codebase with clear separation of concerns
3. **Code Quality**: Maintained using UV (package manager) and Ruff (linter/formatter)
4. **Maximum File Size**: Strict 500-line limit per file to ensure maintainability
5. **Security First**: End-to-end encryption and proper authentication at every level
6. **Ultra-Modern UI/UX**: Sleek, intuitive interface with smooth animations and responsive design

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/username/phrm-v1.git
cd phrm-v1

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies with UV
uv pip install -r backend/requirements.txt

# Run the backend server
cd backend
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Development Roadmap

See `TASKS.md` for the detailed development schedule and milestones.