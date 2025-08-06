import { NavLink } from "react-router";
import "../styles/NavBar.css";

export default function NavBar() {
  return <nav className="NavBar">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/shop">Purchase Cards</NavLink>
    <NavLink to="/gallery">Your Cards</NavLink>
  </nav>;
}
