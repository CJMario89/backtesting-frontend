import { getRequest } from '../common';

export const googleLogin = () => getRequest('/auth/google');
export const googleLogout = () => getRequest('/auth/logout');
export const getProfile = () => getRequest('/auth/profile');
