import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import {useAuth} from "./provider/AuthenticatedUserProvider";

export default function Manager() {
    const {user} = useAuth();

	const location = useLocation();
	const nav = useNavigate();

	useEffect(() => {
        if (!location.pathname.includes("intake")) {
            if(user)
                nav('/home')
            else
                nav('/login')
        }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Outlet/>
		</>
	)
}
