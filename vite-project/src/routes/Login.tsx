import type React from "react";
import NavBar from "../components/Navbar";

function Login() {

  async function createUser(ev: React.FormEvent) {
    ev.preventDefault();

    // Send info to DB

    // Update context
  }
  return (
    <>
      <NavBar/>
      <section className="Login">
        <h1>Log In</h1>
        <section>
            <form onSubmit={createUser}>
                <div>
                    <label htmlFor="user_name">Username:</label>
                    <input type="text" id="user_name" className="user_name" />
                    <label htmlFor="user_pass">Password:</label>
                    <input type="text" id="user_pass" className="user_pass" />
                </div>
                <button>Create Account</button>
            </form>
        </section>
      </section>
    </>
  )
}

export default Login;