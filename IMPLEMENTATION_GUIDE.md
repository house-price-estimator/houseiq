# HouseIQ - Quick Setup Guide

## Prerequisites
- Git, Docker Desktop, JDK 21, Node.js 20+, Python 3.11, Maven 3.8+

## Setup Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd houseiq
   ```

2. **Run Application**
   ```bash
   cd infra
   docker-compose up --build
   ```

## Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- ML Service: http://localhost:8000
- ML Docs: http://localhost:8000/docs

## Troubleshooting
- **Port conflicts**: Stop services on ports 5173, 8080, 8000
- **Logs**: `docker-compose logs -f <service-name>`
- **Rebuild**: `docker-compose up --build`
