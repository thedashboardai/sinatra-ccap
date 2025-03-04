import React, {createContext, useContext, useMemo} from 'react';
import {useNavigate} from "react-router";
import {useLocalStorage} from "../hooks/useLocalStorage";

const AuthenticatedUserContext = createContext<AuthContextType | null>(null)

type Props = {
    children: React.ReactNode;
}

export type AuthContextType = {
    user: any;
    login: (data: any) => Promise<void>;
    logout: () => void;
}

export const AuthenticatedUserProvider = ({children}: Props) => {
    const [user, setUser] = useLocalStorage("user", null)

    const navigate = useNavigate()

    const login = async (data: any) => {
        setUser(data)
        navigate("/home")
    }

    const logout = () => {
        setUser(null)
        navigate("/", { replace: true })
    }

    const value = useMemo(() => ({user, login, logout}), [user])

    return (
        <AuthenticatedUserContext.Provider value={value}>
            {children}
        </AuthenticatedUserContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthenticatedUserContext)
}