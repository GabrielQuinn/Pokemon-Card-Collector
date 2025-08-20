import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import type { Profile } from "../types/types";

function Users() {

  const [ users, setUsers ] = useState<Profile[]>([]);
  const [ friends, setFriends ] = useState<Profile[]>([]);

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

  async function getFriends() {
    try {
      // Get all users

      const api_key = "3d6c1055a3ff6f379823d74b1fb3fdba370c518177abcdea6d870c243f039235";
      const user_name = "gabe";

      const url = `http://localhost/backend/api/friends?user_name=${user_name}`;

      // it requires an API key

      const resp = await fetch(url, {method: "get", headers: {"X-API-KEY": api_key}});

      const jsonResponse = await resp.json();
      setFriends(jsonResponse);
      return jsonResponse;
    } catch (error: unknown) {
      console.error("Error:", error);
    }
  }

  async function addFriend(ev: React.FormEvent) {
    ev.preventDefault();
  }

  useEffect(() => {
    getUsers();
    getFriends();
  }, []);

  return (
    <>
      <NavBar/>
      <section className="Users">
        <h1>Users</h1>
        <section>
          <h2>Friends</h2>
          <section>
            {friends.map((e) => {
              return (
                <div key={e.user_name} className={"userEntry " + e.user_name}>
                  <h2>{e.user_name}</h2>
                  <div>{e.user_creation_date}</div>
                  <form>
                    <button type="submit">View Profile</button>
                  </form>
                </div>
              )
            })}
          </section>
          <h2>Public Accounts</h2>
          <section>
            {users.map((e) => {
              return (
                <div key={e.user_name} className={"userEntry " + e.user_name}>
                  <h2>{e.user_name}</h2>
                  <div>{e.user_creation_date}</div>
                  <form onSubmit={addFriend}>
                    <button type="submit">Add Friend</button>
                  </form>
                </div>
              )
            })}
          </section>
        </section>
      </section>
    </>
  )
}

export default Users;