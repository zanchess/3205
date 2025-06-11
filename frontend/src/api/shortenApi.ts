import axios from 'axios';
import { envConfig } from '../config';

export interface CreateShortUrlPayload {
  originalUrl: string;
  alias?: string;
}

export interface ShortUrlInfoResponse {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface AnalyticsResponse {
  clickCount: number;
  lastIps: string[];
}

export interface ShortUrlResponse {
  shortUrl: string;
}

export interface DeleteShortUrlResponse {
  message: string;
}

export const createShortUrl = async (payload: CreateShortUrlPayload): Promise<ShortUrlResponse> => {
  const res = await axios.post(`${envConfig.backendUrl}/shorten`, payload);
  return res.data;
};

export const getShortUrlInfo = async (shortUrl: string): Promise<ShortUrlInfoResponse> => {
  const res = await axios.get(`${envConfig.backendUrl}/shorten/info/${shortUrl}`);
  return res.data;
};

export const deleteShortUrl = async (shortUrl: string): Promise<DeleteShortUrlResponse> => {
  const res = await axios.delete(`${envConfig.backendUrl}/shorten/delete/${shortUrl}`);
  return res.data;
};

export const getAnalytics = async (shortUrl: string): Promise<AnalyticsResponse> => {
  const res = await axios.get(`${envConfig.backendUrl}/shorten/analytics/${shortUrl}`);
  return res.data;
}; 