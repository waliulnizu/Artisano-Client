let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
if (apiUrl && !apiUrl.endsWith("/api")) {
    apiUrl += "/api";
}
export const API_URL = apiUrl;
