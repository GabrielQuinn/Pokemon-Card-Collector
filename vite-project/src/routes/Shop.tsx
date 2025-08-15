import NavBar from "../components/Navbar";
import { useState } from "react";
import type { Card } from "../types/types";
import "../styles/index.css";

function Shop() {

    const [ currentCard, setCurrentCard ] = useState<Card | null>(null);

    async function getCard() {

        try {

            // call API

            const id = Math.floor(Math.random() * (154 - 1 + 1)) + 1;

            const url = `http://localhost/backend/api/cards/${id}`;

            const resp = await fetch(url);

            const jsonResponse = await resp.json();

            setCurrentCard(jsonResponse);
            console.log(jsonResponse);
            return jsonResponse;
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    async function addCard() {
        // call API
        try {
            
            const apiKey = "54c763a8770253e9cc5d917be2ef95dad55112f9f8f82f3eebeeb74c93f45212";
            const url = "http://localhost/backend/api/library";

            const formData = new FormData();
            const card_image = currentCard?.image as string;
            const card_rarity = currentCard?.rarity as string;
            const user_name = "gabe" as string;
            const card_name = currentCard?.name as string;

            formData.append("card_image", card_image);
            formData.append("card_rarity", card_rarity);
            formData.append("user_name", user_name);
            formData.append("card_name", card_name);

            const resp = await fetch(url, {method: "post", headers: {"X-API-KEY": apiKey}, body: formData});

            if (resp.status != 204) {
                const jsonResponse = await resp.json();
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
            <NavBar />
            <section className="Shop">
                <h1>Shop</h1>
                <section>
                    <div className={currentCard != null ? "hidden" : ""}>
                        <label htmlFor="search">Package: </label>
                        <input type="number" id="search" name="search" min={1} max={100} />
                    </div>
                    <div className={"" + (currentCard != null ? "" : "hidden")}>
                        <h3>Card Name: {currentCard?.name}</h3>
                        <img src={currentCard?.image} alt={`The ${currentCard?.name} Pokemon card`} />
                        <p>Rarity: {currentCard?.rarity}</p>
                    </div>
                    <button onClick={getCard} className={"revealBtn " + (currentCard != null ? "hidden" : "")}>Reveal Card</button>
                    <div>
                        <button onClick={addCard} className={currentCard != null ? "" : "hidden"}>Add to Library</button>
                        <button className={currentCard != null ? "" : "hidden"}>Next Card</button>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Shop;