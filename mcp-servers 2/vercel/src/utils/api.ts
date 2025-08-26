import axios, { AxiosRequestConfig } from 'axios';
import { VERCEL_API, VERCEL_API_TOKEN } from "./config.js";

export async function vercelFetch<T>(
  endpoint: string,
  options: AxiosRequestConfig = {},
): Promise<T | null> {
  try {
    const headers = {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await axios({
      url: `${VERCEL_API}${endpoint}`,
      method: options.method || 'GET',
      headers,
      data: options.data,
      ...options,
    });

    return response.data as T;
  } catch (error) {
    console.error("Vercel API error:", error);
    return null;
  }
}
