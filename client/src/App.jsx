import './App.css'
import { LandingPage } from './components/LandingPage.jsx'
import { LeaderboardPage } from './components/LeaderboardPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Auth/login.jsx';
import { Register } from './components/Auth/Register.jsx';
import { StudentDashboard } from './components/StudentDashboardPage.jsx';
function App() {
  return(
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/student/dashboard' element={<StudentDashboard />} />
        </Routes>
      </div>

    </Router>
  )
}

export default App
