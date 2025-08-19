import { NavLink } from "react-router";

export default function NavBar() {
  return <nav className="NavBar">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/shop">Shop</NavLink>
    <NavLink to="/library">Library</NavLink>
    <NavLink to="/users">Users</NavLink>
    <NavLink to="/profile/1">Profile</NavLink>
    <NavLink to="/login">Log Out</NavLink>
  </nav>;
}
