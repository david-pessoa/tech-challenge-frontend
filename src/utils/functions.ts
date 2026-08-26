export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export function getLocalStorageToken() {
  return localStorage.getItem('token')
}
export function setLocalStorageToken(token: string) {
  return localStorage.setItem('token', token)
}
export function clearLocalStorageToken() {
  return localStorage.setItem('token', '')
}
