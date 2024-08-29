import { browser, dev } from '$app/environment';

export const HOSTNAME = browser ? (dev ? `${location.hostname}:5173` : `${location.hostname}`) : '';
export const BASE_URL = browser ? (dev ? `http://${HOSTNAME}` : `https://${HOSTNAME}`) : '';
export const API_BASE_URL = `${BASE_URL}/api`;
