# HouseIQ - Property Price Estimator

<div align="center">

![HouseIQ Logo](https://img.shields.io/badge/HouseIQ-Property%20Estimator-blue?style=for-the-badge)

**AI-Powered Property Price Estimation Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)

</div>

## 📋 Overview

HouseIQ is an end-to-end microservices-based application designed to revolutionize property price estimation in the real estate sector. Unlike traditional methods that rely on ad-hoc spreadsheets and subjective judgment, HouseIQ leverages machine learning to provide accurate, transparent, and data-driven property valuations based on key attributes such as bedrooms, bathrooms, floor area, property age, and location index.

### Key Features

- 🤖 **Machine Learning-Powered Predictions**: Accurate price estimations using scikit-learn regression models
- 🔐 **Secure Authentication**: JWT-based authentication with Spring Security
- 📊 **Prediction History**: Track and audit all property valuations
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Chakra UI
- 🏗️ **Microservices Architecture**: Scalable, maintainable, and independently deployable services
- 🐳 **Docker Support**: Easy deployment with Docker Compose
- 📝 **RESTful API**: Well-structured API following REST conventions
- 🔍 **Transparent Explanations**: Detailed insights for each price estimate

## 🏗️ Architecture

HouseIQ follows a microservices architecture with three main services:

```
┌─────────────────┐
│   Frontend      │  React + Vite + Chakra UI
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Backend       │  Spring Boot 3.5.6 (Java 21)
│   (Port 8080)   │  ┌──────────────┐
└────────┬────────┘  │  MongoDB     │
         │           │  Database    │
         │ HTTP      └──────────────┘
         ▼
┌─────────────────┐
│   ML Service    │  FastAPI + scikit-learn
│   (Port 8000)   │
└─────────────────┘
```

## 🛠️ Tech Stack

### Backend (`houseiq-backend`)
- **Language**: Java 21
- **Framework**: Spring Boot 3.5.6
- **Database**: MongoDB (with Spring Data MongoDB)
- **Security**: Spring Security with JWT authentication
- **HTTP Client**: Spring WebFlux WebClient
- **Build Tool**: Maven
- **Key Libraries**: Lombok, Spring Web, Spring WebFlux

### Frontend (`houseiq-frontend`)
- **Framework**: React 18
- **Build Tool**: Vite 7
- **UI Library**: Chakra UI 2.10
- **Routing**: React Router DOM 7
- **Language**: TypeScript 5.8
- **State Management**: React Context API

### ML Service (`houseiq-ml`)
- **Language**: Python 3.11
- **Framework**: FastAPI
- **ML Library**: scikit-learn
- **Data Processing**: pandas, numpy
- **Model Storage**: joblib

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB (Atlas or local)

## 📁 Project Structure

```
houseiq/
├── houseiq-backend/          # Spring Boot backend service
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── za/co/houseiq/houseiqbackend/
│   │       │       ├── auth/              # Authentication & authorization
│   │       │       ├── common/            # Shared utilities & DTOs
│   │       │       ├── config/             # Configuration classes
│   │       │       └── prediction/        # Prediction domain logic
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── houseiq-frontend/         # React frontend application
│   ├── src/
│   │   ├── api/              # API client utilities
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React context providers
│   │   ├── pages/            # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── houseiq-ml/               # FastAPI ML service
│   ├── main.py               # FastAPI application
│   ├── train.py              # Model training script
│   ├── requirements.txt
│   └── data/                 # Training data
│
└── infra/                    # Infrastructure configuration
    └── docker-compose.yml    # Docker Compose setup
```

## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 21 or higher
- **Node.js**: 20.x or higher
- **Python**: 3.11 or higher
- **Docker**: 20.x or higher (optional, for containerized deployment)
- **MongoDB**: 6.0+ (or MongoDB Atlas account)
- **Maven**: 3.8+ (for backend)

### Installation

#### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd houseiq
   ```

2. **Set up environment variables**
   Create a `.env` file in the `infra/` directory:
   ```env
   SPRING_DATA_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/houseiq_db
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_TTL_SECONDS=86400
   ```

3. **Build and start all services**
   ```bash
   cd infra
   docker-compose up --build
   ```

   Services will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - ML Service: http://localhost:8000
   - ML Service Docs: http://localhost:8000/docs

#### Option 2: Local Development

**Backend Setup:**
```bash
cd houseiq-backend
mvn clean install
mvn spring-boot:run
```

**ML Service Setup:**
```bash
cd houseiq-ml
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend Setup:**
```bash
cd houseiq-frontend
npm install
npm run dev
```

**Environment Configuration:**
- Backend: Configure MongoDB connection in `houseiq-backend/src/main/resources/application.properties`
- Frontend: Set `VITE_API_URL` environment variable (default: `http://localhost:8080/api`)

## 📖 API Documentation

### Backend API

Base URL: `http://localhost:8080/api`

#### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

#### Prediction Endpoints
- `POST /api/predictions` - Create a new prediction
- `GET /api/predictions` - Get user's prediction history
- `GET /api/predictions/{id}` - Get prediction by ID

### ML Service API

Base URL: `http://localhost:8000`

- `POST /predict` - Get property price prediction
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)

**Example Prediction Request:**
```json
{
  "features": {
    "bedrooms": 3,
    "bathrooms": 2,
    "area_sqm": 120.5,
    "age_years": 10,
    "location_index": 5
  }
}
```

## 🧪 Running Tests

### Backend Tests
```bash
cd houseiq-backend
mvn test
```

### Frontend Tests
```bash
cd houseiq-frontend
npm test
```

### ML Service Tests
```bash
cd houseiq-ml
pytest tests/
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- **Java**: Follow Spring Boot conventions, use Lombok for boilerplate reduction
- **TypeScript/React**: Use ES6+ features, functional components with hooks
- **Python**: Follow PEP 8 style guide
- **Commits**: Use descriptive commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Verona Surajlall**
- **Ajmal Ahmad**
- **Azhar Moola**
- **Clivan Tolk**
- **Creflo Jordaan**
- **Dylan Trytsman**

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Advanced ML models (ensemble methods, neural networks)
- [ ] Property image analysis
- [ ] Market trend analysis
- [ ] Comparative market analysis (CMA) reports
- [ ] Mobile application
- [ ] Real-time price alerts
- [ ] Integration with real estate APIs

---

<div align="center">

**Built with ❤️ by the HouseIQ Team**

⭐ Star this repo if you find it helpful!

</div>
