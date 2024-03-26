import Header from "../Header"
import './index.css'

import { FaLongArrowAltRight } from "react-icons/fa";

const Home = () => <div className="home">
    <Header />
    <div className="home-banner-section">
        <img src="/desktop computer.gif" alt="video" />
        <div className="home-banner-section-container">
        <h1 className="home-banner-section-heading">Anusuya Computers</h1>
        <p className="home-banner-section-paragraph">Tech Delivered to Your Doorstep: Click, Shop, Enjoy!</p>
        <button className="home-banner-section-button">Explore Now <FaLongArrowAltRight /></button>
        </div>
    </div>

</div>

export default Home