export function getToken() {
  return getAccessToken() || getRefreshToken();
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function deleteAccessToken() {
  localStorage.removeItem("accessToken");
}

export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
  console.log(getAccessToken());
}

export function setRefreshToken(token: string) {
  localStorage.setItem("refreshToken", token);
}
