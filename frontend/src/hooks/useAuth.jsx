import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const useAuth = () => {
  const token = Cookies.get("jwt");

  if (!token) return null;

  try {
    const user = jwtDecode(token);
    return user;
  } catch (error) {
    return null; // If the token is invalid or expired
  }
};

export default useAuth;
