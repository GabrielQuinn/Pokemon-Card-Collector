import NavBar from "../components/Navbar";
import { useState } from "react";
import "../styles/index.css";

function Shop() {

    const [ displayCard, setDisplayCard ] = useState(false);

    function getCard() {
        setDisplayCard(true);

        // call API
    }

    function addCard() {
        // call API
    }

    console.log(displayCard);

    return (
        <>
            <NavBar />
            <section className="Shop">
                <h1>Shop</h1>
                <section>
                    <div className={displayCard ? "hidden" : ""}>
                        <label htmlFor="search">Package: </label>
                        <input type="number" id="search" name="search" min={1} max={100} />
                    </div>
                    <div className={"" + (displayCard ? "" : "hidden")}>
                        <h3>Card Name</h3>
                        <p>Description</p>
                    </div>
                    <button onClick={getCard} className={"revealBtn " + (displayCard ? "hidden" : "")}>Reveal Card</button>
                    <div>
                        <button onClick={addCard} className={displayCard ? "" : "hidden"}>Add to Library</button>
                        <button className={displayCard ? "" : "hidden"}>Next Card</button>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Shop;