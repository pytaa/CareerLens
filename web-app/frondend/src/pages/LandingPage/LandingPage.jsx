import Hero from "./Hero.jsx"
import Industri from "./Industri.jsx"
import About from "./About.jsx"
import Navbar from "../../components/Navbar.jsx"

export default function LandingPage(){
    return(
        <>
        <Navbar/>
        <h1>Ini landing page</h1>
        <main>
            <Hero/>
            <Industri/>
            <About/>
        </main>
        </>
    )
}