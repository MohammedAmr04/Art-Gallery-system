import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtworkDetail from "./pages/ArtworkDetail";
import ArtistDashboard from "./pages/ArtistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import Test from "./pages/Test";
import EditArtwork from "./pages/EditArtwork";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/test" element={<Test />} />
              <Route path="/edit-artwork/:id" element={<EditArtwork />} />

              <Route
                path="/artist/dashboard"
                element={
                  <ProtectedRoute role="Artist">
                    <ArtistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
