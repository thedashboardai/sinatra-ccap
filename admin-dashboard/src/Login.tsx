import React, {useState} from "react";
import styled from "@emotion/styled";
import {StyleSheet} from "@react-pdf/renderer";
import {Lock1, Sms} from "iconsax-react";
import logo from "./assets/login_logo.png";
import internal from "./assets/internal_login.webp";
import {
    BLUE,
    BORDER_GRAY,
    Button,
    FADE_GRAY,
    InputField,
    MID_GRAY,
} from "@thedashboardai/dashboard-components";
import {useAuth} from "./provider/AuthenticatedUserProvider";

export default function Login() {

    return (
        <div className="App">
            <div className="loginWrapper">
                <TELogin/>
            </div>
        </div>
    )
}

function TELogin() {
    return (
        <>
            <ImageContainer>
                <img className="displayImage" src={internal} alt="wine"/>
                <img className="logoImage" src={logo} alt="logo"/>
            </ImageContainer>
            <LoginContainer>
                <h1 className="title">{"Login with Sinatra"}</h1>
                <h2 className="subtitle">{"Sinatra x C-CAP"}</h2>

                <LoginComponents/>
            </LoginContainer>
        </>
    );
}

function LoginComponents() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const {login} = useAuth();

    const [isLoading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault()

        setLoading(true)

        if(username === 'TestSinatra' && password === 'Sinatra1!') {
            await login({username})
        } else {
            alert('Invalid username or password')
        }

        setLoading(false)
    }

    return (
        <>
            <form onSubmit={handleLogin}>
                <InputField
                    title={"Enter username"}
                    type={"text"}
                    value={username}
                    onChange={(event) => {
                        //@ts-ignore
                        setUsername(event.target.value);
                    }}
                    placeholder={"Enter username"}
                    icon={<Sms color={BLUE}/>}
                    boxStyle={styles.inputField}
                />
                <InputField
                    title={"Enter password"}
                    type={"password"}
                    value={password}
                    onChange={(event) => {
                        //@ts-ignore
                        setPassword(event.target.value);
                    }}
                    placeholder={"Enter password"}
                    icon={<Lock1 color={BLUE}/>}
                    boxStyle={styles.inputField}
                />

                <br/>
                <br/>

                <Button
                    type="submit"
                    color={BLUE}
                    style={{width: "100%", marginTop: 20}}
                    disabled={!username || !password}
                    loading={isLoading}
                >
                    {"Login"}
                </Button>
            </form>
        </>
    );
}

export const styles = StyleSheet.create({
    inputField: {
        width: "100%",
        backgroundColor: "white",
        border: `1px solid ${BORDER_GRAY}`,
    },
});

export const ImageContainer = styled.div`
    .displayImage {
        height: 100%;
        width: 50vw;
        object-fit: cover;
        aspect-ratio: 1;
        pointer-events: none;

        @media screen and (max-width: 950px) {
        width: 0px;
        }
    }

    .logoImage {
        width: 200px;
        position: absolute;
        left: 5%;
        top: 10%;
        pointer-events: none;

        @media screen and (max-width: 950px) {
        top: 2%;
        }
    }
`;

export const LoginContainer = styled.div`
    width: 50%;
    padding: 10% 10%;
    overflow-y: auto;

    @media screen and (max-width: 950px) {
        padding-top: 20vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        font-family: "Raleway";
        font-style: normal;
        font-weight: 500;
        font-size: 44px;
        color: ${FADE_GRAY};
        font-variant-numeric: lining-nums proportional-nums;
    }

    .subtitle {
        font-family: "Raleway";
        font-style: normal;
        font-weight: 500;
        font-size: 20px;

        letter-spacing: -0.02em;
        font-feature-settings: "tnum" on, "lnum" on;

        color: #44a8ff;
    }

    p {
        @media screen and (max-width: 950px) {
        text-align: center;
        }
    }

    .logoImage {
        width: 150px;
        pointer-events: none;
        margin-bottom: 30px;
    }
`;

export const LinkText = styled.div`
    color: ${MID_GRAY};
    font-family: Raleway;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration: none;
    margin: 0px;
    font-variant-numeric: lining-nums proportional-nums;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .linkTextLink {
        color: ${BLUE};
        transition: 250ms;
        cursor: pointer;

        &:hover {
        opacity: 0.6;
        }
    }
`;
