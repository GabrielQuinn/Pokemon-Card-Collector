import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import type { User } from "../types/types";

function Users() {

  const [ users, setUsers ] = useState<User[]>([])

  async function getUsers() {
    try {
      // Get all users

      const user_name = "gabe";

      const url = `http://localhost/backend/api/user/discovery?user_name=${user_name}`;

      const resp = await fetch(url);

      const jsonResponse = await resp.json();
      setUsers(jsonResponse);
      return jsonResponse;
    } catch (error: unknown) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <NavBar/>
      <section className="Users">
        <h1>Users</h1>
        <section>
          {users.map((e) => {
            return (
              <div key={e.user_name} className={"userEntry " + e.user_name}>
                <h2>{e.user_name}</h2>
                <div>{e.user_creation_date}</div>
                <form>
                  <button type="submit">Add Friend</button>
                </form>
              </div>
            )
          })}
        </section>
      </section>
    </>
  )
}

export default Users;