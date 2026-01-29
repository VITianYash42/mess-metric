import { Features } from "./LandingPage/Features.jsx";
import { Hero } from "./LandingPage/Hero.jsx";
import { NavBar } from "./LandingPage/NavBar.jsx";
import { Footer } from "./LandingPage/Footer.jsx";

export function LandingPage(){
  return(
    <>
      <NavBar />
      <Hero />
      <Features />
      <Footer />
    </>
  )
}