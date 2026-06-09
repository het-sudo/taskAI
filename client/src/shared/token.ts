//reusable functions

export function getAccessToken() {
  return localStorage.getItem("accessToken")
}

export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token)
}

export function removeAccessToken() {
  localStorage.removeItem("accessToken")
}
