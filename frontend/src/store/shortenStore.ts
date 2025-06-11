import { create } from 'zustand';
import type { ShortUrlInfoResponse, AnalyticsResponse } from '../api/shortenApi';

interface ShortenState {
  shortUrl: string | null;
  setShortUrl: (url: string | null) => void;
  info: ShortUrlInfoResponse | null;
  setInfo: (info: ShortUrlInfoResponse | null) => void;
  analytics: AnalyticsResponse | null;
  setAnalytics: (analytics: AnalyticsResponse | null) => void;
  clearInfoAndAnalytics: () => void;
}

export const useShortenStore = create<ShortenState>((set) => ({
  shortUrl: null,
  setShortUrl: (url) => set({ shortUrl: url }),
  info: null,
  setInfo: (info) => set({ info }),
  analytics: null,
  setAnalytics: (analytics) => set({ analytics }),
  clearInfoAndAnalytics: () => set({ info: null, analytics: null }),
})); 