import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import type { UserData } from "../types/types";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router";

function Profile() {

    const [ userData, setUserData ] = useState<UserData | null>(null);
    const [ viewKey, setViewKey ] = useState(false);
    const [ editPass, setEditPass ] = useState(false);

    const { user, logout } = useAuth();
    const params = useParams();
    //const navigate = useNavigate();

    async function getUserData() { // Fetch user info (API key, creation date, visibility)
        try {
            
            const user_id = params.pathId;
    
            const url = `http://localhost/backend/api/user/account?user_id=${user_id}`;
    
            const resp = await fetch(url);
    
            const jsonResponse = await resp.json();
    
            setUserData(jsonResponse); // Save in state

            return jsonResponse;
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    async function revealApiKey() { // Toggle API key visibility
        setViewKey(!viewKey);
    }

    async function resetApiKey() { // Change API key
        try {
    
            const apiKey = user?.apikey as string;
            const url = `http://localhost/backend/api/user/account/api`;

            const resp = await fetch(url, {method: "PATCH", headers: {"X-API-KEY": apiKey, "Content-Type": "application/json"}});

            const jsonResponse = await resp.json();

            //setUserData(); // Save in state

            // TODO -- Update auth user with the new api key

            return jsonResponse;
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    async function toggleResetPassword() { // Change password
        const val = !editPass;
        setEditPass(val);
    }

    async function resetPassword(ev: React.FormEvent) {
        ev.preventDefault();

        try {
    
            const apiKey = user?.apikey as string;
            const url = `http://localhost/backend/api/user/account/password`;

            const formData = new FormData(ev.target as HTMLFormElement);
            const jsonData = JSON.stringify(Object.fromEntries(formData));
    
            await fetch(url, {method: "PATCH", headers: {"X-API-KEY": apiKey}, body: jsonData});

        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    async function toggleVisibility() { // Toggle profile visibility
        try {
    
            const apiKey = user?.apikey as string;
            const url = "http://localhost/backend/api/user/account/visibility";
    
            await fetch(url, {method: "PATCH", headers: {"X-API-KEY": apiKey}});

            // TODO -- Update "Set account to Private/Public" after button click
            
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    async function deleteAccount() {
        try {
    
            const apiKey = user?.apikey as string;
            const url = `http://localhost/backend/api/user/account`;
    
            await fetch(url, {method: "PATCH", headers: {"X-API-KEY": apiKey}});

            // Log out user
            logout();

            //navigate("/login");
            
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    const ownerProfile = userData?.user_name == user?.username;

    const userApi = userData?.user_api as string;

    return (
        <>
            <NavBar />
            <section className="Profile">
                <h1>{userData?.user_name != user?.username && userData?.user_name != undefined ? userData?.user_name + "'s " : ""}Profile</h1>
                <section>
                    <div>
                        <div>Username:</div>
                        <div>{userData?.user_name}</div>
                        <div>Visibility:</div>
                        <div>{userData?.user_public == 1 ? "Public" : "Private"}</div>
                        <div>Creation Date:</div>
                        <div>{userData?.user_creation_date}</div>
                        <div className={!ownerProfile ? "hidden" : ""}>API Key:</div>
                        <div className={!ownerProfile ? "hidden" : ""}>{viewKey || userApi == undefined ? userApi : userApi.slice(0, 12) + "..."}</div>
                    </div>
                    <form onSubmit={resetPassword} className={editPass ? "" : "hidden"}>
                        <label htmlFor="new_pass">New Password:</label>
                        <input type="text" id="new_pass" name="new_pass" />
                        <button type="submit">Update</button>
                    </form>
                    <div className={!ownerProfile ? "hidden" : ""}>
                        <button onClick={revealApiKey}>View Full API Key</button>
                        <button onClick={resetApiKey}>Reset API Key</button>
                        <button onClick={toggleResetPassword}>Change Password</button>
                        <button onClick={toggleVisibility}>Set account to {userData?.user_public == 1 ? "Private" : "Public"}</button>
                        <button onClick={deleteAccount}>Delete Account</button>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Profile;