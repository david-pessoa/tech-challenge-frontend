export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export function getLocalStorageToken() {
  return localStorage.getItem('token')
}
export function setLocalStorageToken(token: string) {
  return localStorage.setItem('token', token)
}
export function clearLocalStorageToken() {
  return localStorage.removeItem('token')
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function buildApiImageUrl(image: string | null) {
  if (!image) {
    return '';
  }

  if (image.startsWith('http')) {
    return image;
  }


  return `${BASE_URL}${image}`;
}
