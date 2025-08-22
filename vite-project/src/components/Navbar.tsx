import { NavLink } from "react-router";
//import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {

  //const { user } = useAuth(); // fix this later. 

  // id is not part of the type!

  return <nav className="NavBar">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/shop">Shop</NavLink>
    <NavLink to="/library">Library</NavLink>
    <NavLink to="/users">Users</NavLink>
    <NavLink to={"/profile/" + 1 /*user?.id*/}>Profile</NavLink>
    <NavLink to="/login">Log Out</NavLink>
  </nav>;
}
