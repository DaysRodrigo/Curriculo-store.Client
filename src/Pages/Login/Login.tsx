import React from "react";
import { useNavigate } from "react-router-dom";
import '../../Styles/Global.css';
import styles from './Login.module.css';
import imgLogin from '../../assets/images/13108.jpg';
import { login } from "../../Services/LoginService";
import { jwtDecode } from "jwt-decode";

interface user {
    name: string;
    email: string;
    tipo: number;
    message: string;
    token: string;
}

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) { 
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                const now = Date.now() / 1000;

                if ( decoded.exp > now) {
                    if (decoded.tipo === 2 || decoded.tipo === 1) {
                        navigate("/crud");
                    } else {
                        navigate("/");
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [navigate]);


    const isTokenValid = () => { 
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const now = Date.now() / 1000;
            return decoded.exp > now;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin(email, password);
    };

    const handleLogin = async (email: string, password: string) => {
        if (!email || !password) {
            setErrorMessage(null);
            setErrorMessage("Preencha todos os campos");
            if (!email) {
                document.getElementById("email")?.focus();
            } else if (!password) {
                document.getElementById("password")?.focus();
            }
            return;
        } 
        try {
            const response = await login(email, password);
            if (response) { 
                const user: user = response;

                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", user.token);

                if ( (user.tipo === 2 || user.tipo === 1) && isTokenValid()) {
                    navigate("/crud");
                } else {
                    navigate("/");
                }

            } else {
                setErrorMessage(null);
                setErrorMessage("Usuário ou senha inválidos");
            }
            
        } catch (error: any) {
            setErrorMessage(null);
            setErrorMessage("Erro ao fazer login: " + error.message);
        }
    };


    return (
        <>
            <div className="bg-white flex flex-col items-center min-h-screen justify-center">
                <div className="mt-5 m-2">
                    <img src={imgLogin} alt="Imagem de Login" className="h-96 rounded-lg" />
                </div>
                <div className={`${styles.cardLogin}`}>
                    {errorMessage && (<div className="text-red-500 text-sm p-1">{errorMessage}</div>)}
                    <form className={`${styles.formLogin} flex flex-col`} onSubmit={(handleSubmit)}>
                        <label className="text-black" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" className={`${styles.inputLogin}`} 
                        onChange={e => setEmail(e.target.value)} value={email} />
                        <label className="text-black" htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" className={`${styles.inputLogin}`}
                        onChange={e => setPassword(e.target.value)} value={password} />
                        <button type="submit" className={`${styles.btnLg}`}>Login</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;