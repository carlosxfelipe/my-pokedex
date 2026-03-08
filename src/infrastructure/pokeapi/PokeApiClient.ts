import axios from "axios";

export const pokeApiClient = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
});

// Cache simples em memória para evitar requisições repetidas
const cache = new Map<string, unknown>();

export async function cachedGet<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }
  const { data } = await pokeApiClient.get<T>(url);
  cache.set(url, data);
  return data;
}
