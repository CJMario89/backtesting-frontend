import { getRequest } from '../common';

export const getSubscriptionLinks = (query: Record<string, string>) =>
  getRequest('/payment/create/subscriptions', query);
