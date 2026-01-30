import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api";

// create context
interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

// provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // run once on app load (page refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem("chatuser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // login
  const login = (data) => {
    setUser(data);
  };

  // logout
  const logout = () => {
    localStorage.removeItem("chatuser");
    setUser(null);
  };

  // getMe
  useEffect(() => {
    api.get('/api/auth/me', {withCredentials : true})
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, setUser,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
