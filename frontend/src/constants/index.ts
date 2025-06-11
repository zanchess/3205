import { AnalyticsResponse, ShortUrlInfoResponse } from '../api/shortenApi.ts';

export type ShortUrlKeys = keyof  AnalyticsResponse | keyof ShortUrlInfoResponse;

export const ANALYTICS_VIEW: Record<ShortUrlKeys, string> = {
  originalUrl: 'Original URL',
  createdAt: 'Created At',
  clickCount: 'Click Count',
  lastIps: 'Last IPs',
};