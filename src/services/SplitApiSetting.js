import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../store/slices/authSlice";
import { BASE_URL } from "./ApiEndpoints";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  fetchFn: async (input, init) => {
    try {
      const url = input instanceof Request ? input.url : input;
      const isAuthCheck = url.includes('/auth/check');
      
      const cacheHeaders = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      
      if (input instanceof Request) {
        const newHeaders = new Headers(input.headers);
        Object.entries(cacheHeaders).forEach(([key, value]) => {
          newHeaders.set(key, value);
        });
        
        if (isAuthCheck) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            const normalized = String(token).trim();
            const bearer = normalized.toLowerCase().startsWith('bearer ')
              ? normalized
              : `Bearer ${normalized}`;
            newHeaders.set('Authorization', bearer);
          }
        }
        return fetch(new Request(input, { headers: newHeaders }));
      }
      
      const headers = new Headers(init?.headers || {});
      Object.entries(cacheHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      if (isAuthCheck) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const normalized = String(token).trim();
          const bearer = normalized.toLowerCase().startsWith('bearer ')
            ? normalized
            : `Bearer ${normalized}`;
          headers.set('Authorization', bearer);
        }
      }
      return fetch(input, { ...init, headers });
    } catch (e) {
      return fetch(input, init);
    }
  },
  prepareHeaders: async (headers, { getState }) => {
    try {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      
      headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");

      const token = getState().auth?.user?.token;
      
      const localStorageToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const finalToken = token || localStorageToken;
      
      if (finalToken) {
        const normalized = String(finalToken).trim();
        const bearerToken = normalized.toLowerCase().startsWith('bearer ')
          ? normalized
          : `Bearer ${normalized}`;
        headers.set("Authorization", bearerToken);
      }
    } catch (err) {
      console.error("Error preparing headers:", err);
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.error("Network error in baseQueryWithReauth:", result.error);
  }
  
  if (result.error && result.error.status === 401) {
    const request = args[0];
    const urlString = request?.url || '';
    
    if (typeof urlString === 'string' && (
      urlString.includes('/auth/') || 
      urlString.includes('/profile') ||
      urlString.includes('/dashboard') ||
      urlString.includes('/admin/') ||
      urlString.includes('/staff/') ||
      urlString.includes('/company-owner/')
    )) {
      console.log('SplitApiSetting: 401 on protected endpoint (no auto-logout).');
    }
  }
  
  if (result.error && result.error.status === 403) {
    const request = args[0];
    const urlString = request?.url || '';
    
    if (typeof urlString === 'string' && (
      urlString.includes('/auth/') || 
      urlString.includes('/profile') ||
      urlString.includes('/dashboard') ||
      urlString.includes('/admin/') ||
      urlString.includes('/staff/') ||
      urlString.includes('/company-owner/')
    )) {
      console.log('SplitApiSetting: 403 on protected endpoint (no auto-logout).');
    }
  }
  
  return result;
};

export const SplitApiSettings = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [],
});
