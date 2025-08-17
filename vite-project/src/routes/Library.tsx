import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import type { LibraryCard } from "../types/types";
import Card from "../components/Card";

function Library() {

  const [cards, setCards] = useState<LibraryCard[]>([]);

  async function fetchCards() {
    try {
      // Get all cards

      const user_name = "gabe";

      const url = `http://localhost/backend/api/library?user_name=${user_name}`;

      const resp = await fetch(url);

      const jsonResponse = await resp.json();
      setCards(jsonResponse);
      return jsonResponse;
    } catch (error: unknown) {
      console.error("Error:", error);
    }
  }

  async function removeFromLibrary(ev: React.FormEvent) {
    ev.preventDefault();
    try {
      // Remove card

      const target = ev.target as HTMLElement;

      const user_name = "gabe";
      const card_name = (target?.parentElement as HTMLElement).classList[1];

      const url = `http://localhost/backend/api/library?user_name=${user_name}&card_name=${card_name}`;

      const resp = await fetch(url, {method: "delete"});

      if (resp.status != 204) {
        const jsonResponse = await resp.json();
        return jsonResponse;
      } else {
        fetchCards();
        return null;
      }
    } catch (error: unknown) {
      throw new Error("Error: " + error);
    }
  }

  useEffect(() => {
    fetchCards();
  }, []);
  
  return (
    <>
      <NavBar/>
      <section className="Library">
        <h1>Library</h1>
        <section>
          {cards.map((e) => {
            return (
              <div key={e.card_id} className={"cardEntry " + e.card_name + " " + e.card_id}>
                <Card key={e.card_id} name={e.card_name} image={e.card_image} rarity={e.card_rarity} />
                <form onSubmit={removeFromLibrary}>
                  <button type="submit">Remove from Library</button>
                </form>
              </div>
            )
          })}
        </section>
      </section>
    </>
  )
}

export default Library;