import { createContext, useState, useContext, useEffect } from "react";
import { resgisterRequest, loginRequest, logoutRequest, verifyTokenRequest } from "../api/auth";

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkLogin() {
            try {
                const res = await verifyTokenRequest();
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

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

    const logout = async () => {
        try {
            await logoutRequest();
        } catch {
            // Si falla la petición, igual limpiamos estado local
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setErrors([]);
        }
    };

        return (
            <AuthContext.Provider value={{
                signup,
                signin,
                logout,
                user,
                isAuthenticated,
                errors,
                loading,

            }}>
                {children}
            </AuthContext.Provider>
        )
    };