import React from "react";
import {useNavigate} from "react-router";
import {Button} from "@thedashboardai/dashboard-components";

const NotFound = () => {

    const navigate = useNavigate()

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                maxHeight: '100vh',
                height: '100%',
                gap: '0',
            }}
        >
            <h2>{'Page not found.'}</h2>
            <br/>

            <Button
                onClick={() => {
                    navigate('/')
                }}
                style={{marginBottom: 20}}
            >
                {'Home'}
            </Button>
        </div>
    );
};

export default NotFound;
