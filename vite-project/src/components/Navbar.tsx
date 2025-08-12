import { NavLink } from "react-router";
import "../styles/NavBar.css";

export default function NavBar() {
  return <nav className="NavBar">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/shop">Shop</NavLink>
    <NavLink to="/gallery">Library</NavLink>
  </nav>;
}
