// Plugin to restore the auth session on app start.
// Token persistence itself is handled inside the auth store mutations
// (access_token / refresh_token are written to localStorage there).
export default (store) => {
  // If an access token exists in localStorage, load the current user.
  store.dispatch('auth/initializeAuth')
}
