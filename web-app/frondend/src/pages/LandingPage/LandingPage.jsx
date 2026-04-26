import Hero from "./Hero.jsx"
import Industri from "./Industri.jsx"
import About from "./About.jsx"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer.jsx"


export default function LandingPage(){
    return(
        <>
        <Navbar/>  
        <main>
            <Hero/>
            <Industri/>
            <About/>
        </main>
        <Footer/>
        </>
    )
}