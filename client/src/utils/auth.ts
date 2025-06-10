// Проверка наличия JWT токена
export const isAuthenticated = () => {
  return !!localStorage.getItem("jwtToken");
};
