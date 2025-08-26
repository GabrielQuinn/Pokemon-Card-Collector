import type { Card as CardProps } from "../types/types";

function Card({ name, image, rarity }: CardProps ) {
  return (
    <>
      <div className="Card">
        <h2 className={rarity.toLowerCase()}>{name}</h2>
        <img src={image} alt={name != undefined ? "The official " + name + " Pokemon card" : ""} />
        <p>Rarity: {rarity}</p>
      </div>
    </>
  )
}

export default Card;