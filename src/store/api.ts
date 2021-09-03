import { RandomImage } from "../types";

export const UNSPLASH_API = "https://api.unsplash.com";

export const fetchImage = async (): Promise<RandomImage> => {
  const response = await fetch(
    `${UNSPLASH_API}/photos/random?client_id=${process.env.REACT_APP_ACCESS_KEY}`
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors.join("\n"));
  }

  const { id, urls, alt_description } = await response.json();
  return {
    id,
    urls,
    altDescription: alt_description,
  };
};
