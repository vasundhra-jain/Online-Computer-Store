import Category from "../Category";
import Header from "../Header"
import './index.css'

import { FaLongArrowAltRight } from "react-icons/fa";

const category = [
    {
        id: 100,
        categoryName: 'Laptop',
        image: 'https://img.freepik.com/free-psd/computer-isolated-transparent-background_191095-26224.jpg?w=740&t=st=1711557330~exp=1711557930~hmac=f74fe82aefada6cea117abaa65a35a18a392b03f92bb249e958ef79c7780766d'
    },
    {
        id: 101,
        categoryName: 'Computer',
        image: 'https://img.freepik.com/free-psd/computer-isolated-transparent-background_191095-29094.jpg?w=740&t=st=1711557405~exp=1711558005~hmac=1c1f7e8dea267bee22ecfcf7a99bcd3c5bbc31613e08d14730bee5f450997eab',
    },
    {
        id: 102,
        categoryName: 'Keyboard',
        image: 'https://img.freepik.com/free-psd/keyboard-isolated-transparent-background_191095-24325.jpg?w=740&t=st=1711557465~exp=1711558065~hmac=67de688ed4d4ba8f6ab371f176fd79eb773c156b0a408a608bdb3b9d966ce471',
    },
    {
        id: 103,
        categoryName: 'Mouse',
        image: 'https://img.freepik.com/free-psd/computer-mouse-isolated-transparent-background_191095-18069.jpg?w=740&t=st=1711557475~exp=1711558075~hmac=d68982f2a8aad9e65ec5eeae37f256e1e8b0f297e937b0195f86dbe43935a21d',
    }
]

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
    <div className="home-category-section">
        {category.map(eachCategory =>
            <Category id={eachCategory.id} categoryDetail={eachCategory} />)}
    </div>

</div>

export default Home