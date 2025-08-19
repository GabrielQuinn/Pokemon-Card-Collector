import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import type { UserData } from "../types/types";
import { useAuth } from '../contexts/AuthContext';

function Profile() {

    const [ userData, setUserData ] = useState<UserData | null>(null)

    const { user } = useAuth();

    async function getUserData() {
        try {
    
            // call API

            const user_name = user?.username;
    
            const url = `http://localhost/backend/api/user/account?user_name=${user_name}`;
    
            const resp = await fetch(url);
    
            const jsonResponse = await resp.json();
    
            setUserData(jsonResponse);
            return jsonResponse;
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <>
            <NavBar />
            <section className="Profile">
                <h1>Profile</h1>
                <section>
                    <div>
                        <div>Username:</div>
                        <div>{userData?.user_name}</div>
                        <div>Visibility:</div>
                        <div>{userData?.user_public == 1 ? "Public" : "Private"}</div>
                        <div>Creation Date:</div>
                        <div>{userData?.user_creation_date}</div>
                        <div>API Key:</div>
                        <div>{userData?.user_api.slice(0, 15)}...</div>
                    </div>
                    <button>View Full API Key</button>
                    <button>Reset API Key</button>
                    <button>Change Password</button>
                    <button>Set account to {userData?.user_public == 1 ? "Private" : "Public"}</button>
                </section>
            </section>
        </>
    )
}

export default Profile;