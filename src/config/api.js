/**
 * Adresse de base de l'API.
 *
 * - En développement : http://localhost:5000 (serveur Express lancé séparément).
 * - En production : chaîne vide, donc les requêtes sont relatives et passent par
 *   le même domaine que le frontend (Express sert aussi le build React).
 *
 * On peut forcer une autre adresse avec VITE_API_URL dans le fichier .env.
 */
const configuredUrl = import.meta.env.VITE_API_URL

export const API_URL = (
    configuredUrl !== undefined && configuredUrl !== null && configuredUrl !== ""
        ? configuredUrl
        : import.meta.env.DEV
            ? "http://localhost:5000"
            : ""
).replace(/\/+$/, "")

export default API_URL
