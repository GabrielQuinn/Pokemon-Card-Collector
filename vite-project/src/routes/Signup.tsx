
import { useAuth } from "../contexts/AuthContext";
import type { User } from "../types/types";
import { NavLink, useNavigate } from "react-router";
import NavBar from "../components/Navbar";

function Signup() {

  const { login } = useAuth();
  const navigate = useNavigate();

  async function signUp(ev: React.FormEvent) {
    ev.preventDefault();

    try {
  
      const url = `http://localhost/backend/api/user/account/create`;

      const formData = new FormData(ev.target as HTMLFormElement);
    
      const resp = await fetch(url, {method: "post", body: formData});

      if (resp.status == 200) {

        const jsonResponse = await resp.json();

        login({username: jsonResponse["user_name"], apikey: jsonResponse["user_api"], id: jsonResponse["user_id"]} as User);

        // Redirect user

        navigate("/");

      } else {

        // Error creating account

        const errorDisplay = document.getElementById("errorDisplay") as HTMLElement;
        errorDisplay.classList.remove("hidden");

      }

    } catch (error: unknown) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <NavBar/>
      <section className="Signup">
        <h1>Sign Up</h1>
        <section>
          <form onSubmit={signUp}>
              <div>
                <label htmlFor="user_name">Username:</label>
                <input type="text" id="user_name" name="user_name" />
                <label htmlFor="user_pass">Password:</label>
                <input type="password" id="user_pass" name="user_pass" />
              </div>
              <div id="errorDisplay" className="hidden error">Error creating account</div>
              <div>Already have an account? <NavLink to="/login">Log In</NavLink></div>
              <button>Sign Up</button>
            </form>
        </section>
      </section>
    </>
  )
}

export default Signup;