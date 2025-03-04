import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter} from "react-router-dom";
import {RouterProvider} from "react-router";
import {ProtectedRoute} from './ProtectedRoute';
import App from './App';
import NotFound from './NotFound';
import Login from './Login';
import Intake from './Intake';
import Home from './pages/Home'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <NotFound/>,
        children: [
            /*{
                index: true,
                element: <Login/>
            },*/
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "home",
                element: (<ProtectedRoute><Home/></ProtectedRoute>)
            },
            {
                path: "intake",
                element: <Intake/>
            },
            /*{
                path: "portal",
                children: [
                    {
                        path: "login",
                        element: (<PortalLoginPage/>)
                    },
                ]
            },*/
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

reportWebVitals();
