export interface LibraryCard {
  card_id: number;
  card_image: string;
  card_rarity: string;
  card_name: string;
  card_owner: string;
}

export interface Card {
  name: string;
  image: string;
  rarity: string;
}

export interface UserData {
  user_name: string;
  user_api: string;
  user_creation_date: string;
  user_public: number;
}

export interface Profile {
  user_name: string;
  user_creation_date: string;
}

export interface User {
  username: string
  apikey: string
}
