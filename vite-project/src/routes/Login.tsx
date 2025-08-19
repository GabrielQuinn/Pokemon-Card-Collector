import type React from "react";
import { useAuth } from "../contexts/AuthContext";
import type { User } from "../types/types";
import NavBar from "../components/Navbar";

function Login() {

  const { user, login } = useAuth();

  async function logIn(ev: React.FormEvent) {
    ev.preventDefault();
    try {
        const url = "http://localhost/backend/api/user/account/login";

        const formData = new FormData(ev.currentTarget as HTMLFormElement);

        const resp = await fetch(url, {method: "post", body: formData});

        if (resp.status != 204) {
            const jsonResponse = await resp.json();
            if (resp.status == 200) {
              const usernameInput = document.getElementById("user_name") as HTMLInputElement;
              const username = usernameInput?.value;
              login({username: username, apikey: jsonResponse} as User);
            }
            return jsonResponse;
        } else {
            return null;
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
                    <input type="text" id="user_name" className="user_name" />
                    <label htmlFor="user_pass">Password:</label>
                    <input type="password" id="user_pass" className="user_pass" />
                </div>
                <button>Log In</button>
            </form>
            {user?.username != undefined ? (
              <h2>Successfully Logged In</h2>
            ) : (
              <div></div>
            )}
        </section>
      </section>
    </>
  )
}

export default Login;