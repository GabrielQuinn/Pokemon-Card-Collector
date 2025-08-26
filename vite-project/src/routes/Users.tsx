import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/Navbar";
import type { Profile } from "../types/types";
import { useAuth } from "../contexts/AuthContext";

function Users() {

  const [ users, setUsers ] = useState<Profile[]>([]);
  const [ friends, setFriends ] = useState<Profile[]>([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  async function getUsers() {
    try {
      // Get all users
      const user_id = user?.id;

      const url = `http://localhost/backend/api/user/discovery?user_id=${user_id}`;

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
      const api_key = user?.apikey as string;
      const user_name = user?.username;

      const url = `http://localhost/backend/api/friends?user_name=${user_name}`;

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

    try {
      const target = ev.target as HTMLElement;
      const new_username = target.dataset.username as string;
      
      const api_key = user?.apikey as string;
      const user_name = user?.username as string;

      const url = "http://localhost/backend/api/friends";

      const formData = new FormData();
      formData.append("current_username", user_name);
      formData.append("new_username", new_username);

      await fetch(url, {method: "post", headers: {"X-API-KEY": api_key}, body: formData});

      getFriends();
    } catch (error: unknown) {
      console.error("Error:", error);
    }
  }

  async function viewProfile(ev: React.FormEvent) {
    ev.preventDefault();

    // Get the id using data-id but first change query to fetch and display user_id

    const target = ev.target as HTMLElement;
    const profile_id = target.dataset.id as string;

    navigate("/Profile/" + profile_id)
  }

  async function removeFriend(ev: React.FormEvent) {
    ev.preventDefault();

    try {
      const target = ev.target as HTMLElement;
      const new_username = target.dataset.username as string;
      
      const api_key = user?.apikey as string;
      const user_name = user?.username as string;

      const url = `http://localhost/backend/api/friends?current_username=${user_name}&new_username=${new_username}`;
      
      await fetch(url, {method: "delete", headers: {"X-API-KEY": api_key}});

      getFriends();
    } catch (error: unknown) {
      console.error("Error:", error);
    }
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
            {friends.length > 0 ? (
              friends.map((e) => (
                  <div key={e.user_name} className={"userEntry " + e.user_name}>
                    <h2>{e.user_name}</h2>
                    <div>{e.user_creation_date}</div>
                    <form onSubmit={viewProfile} data-username={e.user_name} data-id={e.user_id}>
                      <button type="submit">View</button>
                    </form>
                    <form onSubmit={removeFriend} data-username={e.user_name} data-id={e.user_id}>
                      <button type="submit">Remove</button>
                    </form>
                  </div>
                )
            )) : (<div>Empty</div>)}
          </section>
          <h2>Public Accounts</h2>
          <section>
            {users.map((e) => {
              return (
                <div key={e.user_name} className={"userEntry " + e.user_name}>
                  <h2>{e.user_name}</h2>
                  <div>{e.user_creation_date}</div>
                  <form onSubmit={addFriend} data-username={e.user_name} data-id={e.user_id}>
                    <button type="submit">Add</button>
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