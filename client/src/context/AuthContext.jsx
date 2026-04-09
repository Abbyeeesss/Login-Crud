import { createContext, useState, useContext } from "react";
import { resgisterRequest, loginRequest } from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors,setErrors] = useState([]);

    const signup = async (user) => {
        try {
            const res = await resgisterRequest(user);
            console.log(res)
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error.response)
          setErrors(error.response.data)
        }
    }

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res);
            setIsAuthenticated(true);
            setUser(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

        return (
            <AuthContext.Provider value={{
                signup,
                signin,
                user,
                isAuthenticated,
                errors,

            }}>
                {children}
            </AuthContext.Provider>
        )
    };