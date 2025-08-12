import NavBar from "../components/Navbar";
import { useState } from "react";
import "../styles/index.css";

function Shop() {

    const [ displayCard, setDisplayCard ] = useState(false);

    function getCard() {
        setDisplayCard(true);

        // call API

        const url = "https://api.pokemontcg.io/v2/cards?q=nationalPokedexNumbers:1";

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            }).catch((err) => console.log(err))
    }

    function addCard() {
        // call API
    }

    return (
        <>
            <NavBar />
            <section className="Shop">
                <h1>Shop</h1>
                <section>
                    <div>
                        <label htmlFor="search">Package: </label>
                        <input type="text" value={1} id="search" name="search" />
                    </div>
                    <div className={"" + (displayCard ? "" : "hidden")}>
                        <h3>Card Name</h3>
                        <p>Description</p>
                    </div>
                    <button onClick={getCard} className={"revealBtn " + (displayCard ? "hidden" : "")}>Reveal Card</button>
                    <div className={displayCard ? "" : "hidden"}>
                        <button onClick={addCard}>Add to Library</button>
                        <button>Next Card</button>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Shop;