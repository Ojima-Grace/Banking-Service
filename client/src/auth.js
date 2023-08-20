import { createAuthProvider } from 'react-token-auth';

const authProvider = createAuthProvider({
  accessTokenKey: 'access_token',
  onUpdateToken: (token) => fetch('/auth/refresh', {
    method: 'POST',
    body: token.refresh_token
  }).then((r) => r.json())
});

export const useAuth = authProvider.useAuth;
export const authFetch = authProvider.authFetch;
export const login = authProvider.login;
export const logout = authProvider.logout;
