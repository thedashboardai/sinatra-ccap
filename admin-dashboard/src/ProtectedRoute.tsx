import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "./provider/AuthenticatedUserProvider";

export const ProtectedRoute = ({ children }) => {
    const {user} = useAuth();

    if (!user)
        return <Navigate to="/login"/>

    return children;
};