# HouseIQ Frontend

React-based frontend application for the HouseIQ Property Price Estimator platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/              # API client configuration and utilities
├── components/       # Reusable UI components
│   ├── AnimatedBackground.tsx
│   ├── Navbar.tsx
│   └── RealEstateTipsFeed.tsx
├── contexts/         # React context providers
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── PropertyForm.tsx
│   ├── PredictionResult.tsx
│   └── History.tsx
├── App.tsx           # Main application component with routing
├── main.tsx          # Application entry point
├── theme.ts          # Chakra UI theme configuration
└── index.css         # Global styles
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 7** - Build tool and dev server
- **Chakra UI 2.10** - Component library
- **React Router DOM 7** - Client-side routing
- **Emotion** - CSS-in-JS (used by Chakra UI)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

### API Configuration

The API client is configured in `src/api/client.ts`. It handles:
- Authentication token management
- Request/response interceptors
- Error handling

## 🎨 Styling

The application uses Chakra UI with a custom theme defined in `src/theme.ts`. The design features:
- Dark theme with cyan accent colors
- Glassmorphism effects
- Animated backgrounds
- Responsive design

## 📝 Code Style

- Use functional components with React hooks
- Prefer TypeScript for type safety
- Follow existing component patterns
- Use Chakra UI components for UI elements
- Keep components modular and reusable

## 🧪 Testing

```bash
npm test
```

## 📦 Build Output

Production builds are output to the `dist/` directory, which can be served by any static file server.

## 🐳 Docker

The frontend can be containerized using the included Dockerfile:

```bash
docker build -t houseiq-frontend .
docker run -p 5173:5173 houseiq-frontend
```

For production, modify the Dockerfile to use the build command and serve static files.

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Chakra UI Documentation](https://chakra-ui.com)
- [React Router Documentation](https://reactrouter.com)
