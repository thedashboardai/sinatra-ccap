import React from "react";
import "./App.scss";
import Manager from "./Manager";
import {AuthenticatedUserProvider} from "./provider/AuthenticatedUserProvider";

export default function App() {

    return (
        <AuthenticatedUserProvider>
            <Manager/>
        </AuthenticatedUserProvider>
    )
}
