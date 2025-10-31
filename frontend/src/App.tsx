import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PropertyForm from "./pages/PropertyForm";
import PredictionResult from "./pages/PredictionResult";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/property" element={<PropertyForm />} />
        <Route path="/prediction" element={<PredictionResult />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
