import { NavLink } from "react-router";
import NavBar from "../components/Navbar";

function Error() {
  return (
    <>
      <NavBar />
      <section className="Error">
        <h1>Error</h1>
        <div>Looks like an error occured. Try going back to <NavLink to="/">Home</NavLink></div>
      </section>
    </>
  )
}

export default Error;