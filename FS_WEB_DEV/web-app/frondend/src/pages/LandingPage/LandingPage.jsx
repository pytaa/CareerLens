import Hero from "./Hero.jsx"
import Industri from "./Industri.jsx"
import About from "./About.jsx"
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer.jsx"

import {useEffect} from 'react'


export default function LandingPage(){
    useEffect(() => {
    document.title = "CareerLens";
  });

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