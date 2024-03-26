import { Component } from "react"
import './index.css'

class Header extends Component{
    render(){
        return(
            <div className="header">
                <ul className="nav-items-container">
                    <li className="nav-items">Home</li>
                    <li className="nav-items">Explore</li>
                    <li className="nav-items">Cart</li>
                    <li className="nav-items">About Us</li>
                    <li className="nav-items">Logout</li>
                </ul>
            </div>
        )
    }
}
export default Header