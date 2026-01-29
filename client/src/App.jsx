import './App.css'
import { Features } from './components/Features.jsx'
import { Footer } from './components/Footer.jsx'
import { Hero } from './components/Hero.jsx'
import { NavBar }from './components/NavBar.jsx'

function App() {
  return(
    <>
      <NavBar />
      <Hero />
      <Features />
      <Footer />
    </>
  )
}

export default App
