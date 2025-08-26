import { NavLink, useNavigate } from "react-router";
import type React from "react";
import { useAuth } from "../contexts/AuthContext";
import type { User } from "../types/types";
import NavBar from "../components/Navbar";

function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  async function logIn(ev: React.FormEvent) { // Login Form submitted
    ev.preventDefault();
    try {
      const url = "http://localhost/backend/api/user/account/login";

      const formData = new FormData(ev.currentTarget as HTMLFormElement); // Get POST data

      const resp = await fetch(url, {method: "post", body: formData});

      if (resp.status == 200) {
        const jsonResponse = await resp.json();
            
        // Update client data

        const usernameInput = document.getElementById("user_name") as HTMLInputElement;
        const username = usernameInput?.value;
        login({username: username, apikey: jsonResponse["api"], id: jsonResponse["id"]} as User);
            
        // Redirect user

        navigate("/");
        
      } else {

        // Error logging in

        const errorDisplay = document.getElementById("errorDisplay") as HTMLElement;
        errorDisplay.classList.remove("hidden");
      }
    } catch (error: unknown) {
      throw new Error("Error: " + error);
    }
  }

  return (
    <>
      <NavBar/>
      <section className="Login">
        <h1>Log In</h1>
        <section>
          <form onSubmit={logIn}>
              <div>
                <label htmlFor="user_name">Username:</label>
                <input type="text" id="user_name" name="user_name" />
                <label htmlFor="user_pass">Password:</label>
                <input type="password" id="user_pass" name="user_pass" />
              </div>
              <div id="errorDisplay" className="hidden error">Invalid Username or Password</div>
              <div>Don't have an account? <NavLink to="/signup">Create Account</NavLink></div>
              <button>Log In</button>
            </form>
        </section>
      </section>
    </>
  )
}

export default Login;