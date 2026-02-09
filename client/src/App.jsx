import './App.css'
import { LandingPage } from './components/LandingPage.jsx'
import { LeaderboardPage } from './components/LeaderboardPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Auth/login.jsx';
import { Register } from './components/Auth/Register.jsx';
import { StudentDashboardPage } from './components/StudentDashboardPage.jsx';
import { StudentProfilePage } from './components/StudentProfilePage.jsx';
import { ProtectedRoute } from './components/Auth/ProtectedRoute.jsx'; // <--- Import this

function App() {
  return(
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path='/register' element={<Register />} />
          
          {/* WRAP THE PROTECTED ROUTES LIKE THIS: */}
          <Route element={<ProtectedRoute />}>
             <Route path='/student/dashboard' element={<StudentDashboardPage />} />
             <Route path='/student/profile' element={<StudentProfilePage />} />
          </Route>

        </Routes>
      </div>
    </Router>
  )
}

export default App