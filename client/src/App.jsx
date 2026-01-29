import './App.css'
import { LandingPage } from './components/LandingPage.jsx'
import { AuthPage } from './components/AuthPage.jsx';
import { LeaderboardPage } from './components/LeaderboardPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>

    </Router>
  )
}

export default App
