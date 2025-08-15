import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import type { Card as CardProps } from "../types/types";
import Card from "../components/Card";

function All() {

    const [ cards, setCards ] = useState<CardProps[]>([]);
    
    async function getCards() {
    
        try {
    
            // call API
    
            const url = "http://localhost/backend/api/cards";
    
            const resp = await fetch(url);
    
            const jsonResponse = await resp.json();
    
            setCards(jsonResponse);
            return jsonResponse;
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        getCards();
    }, []);

    return (
        <>
            <NavBar />
            <section className="All">
                <h1>All Cards</h1>
                {cards.map((e) => {
                    return ( // give key to card
                        <div className={"cardEntry"}>
                            <Card name={e.name} image={e.image} rarity={e.rarity} />
                        </div>
                    )
                })}
            </section>
        </>
    )
}

export default All;