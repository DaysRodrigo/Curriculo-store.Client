import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { login } from "../../Services/LoginService";
import { jwtDecode } from "jwt-decode";

interface User {
    name: string;
    email: string;
    tipo: number;
    message: string;
    token: string;
}

interface JwtPayload {
    exp: number;
    tipo: number;
    [key: string]: unknown;
}

export function Login () {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

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

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await login(email, password);
            if (response) { 
                const user: User = response as User;

                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", user.token);

                toast({
                    title: "Login successefull.",
                    description: `Welcome, ${user.name}`,
                })

                if ( (user.tipo === 2 || user.tipo === 1) && isTokenValid()) {
                    navigate("/crud");
                } else {
                    navigate("/");
                }

            } else {
                setErrorMessage(null);
                setErrorMessage("Usuário ou senha inválidos");
            }
            
        } catch (error: unknown) {
            if( error instanceof Error ) {
                setErrorMessage("Erro ao fazer login: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };


    // return (
    //     <>
    //         <div className="bg-white flex flex-col items-center min-h-screen justify-center">
    //             <div className="mt-5 m-2">
    //                 <img src={imgLogin} alt="Imagem de Login" className="h-96 rounded-lg" />
    //             </div>
    //             <div className="">
    //                 {errorMessage && (<div className="text-red-500 text-sm p-1">{errorMessage}</div>)}
    //                 <form className="" onSubmit={(handleSubmit)}>
    //                     <label className="text-black" htmlFor="email">Email</label>
    //                     <input type="email" id="email" name="email" className="" 
    //                     onChange={e => setEmail(e.target.value)} value={email} />
    //                     <label className="text-black" htmlFor="password">Password</label>
    //                     <input type="password" id="password" name="password" className=""
    //                     onChange={e => setPassword(e.target.value)} value={password} />
    //                     <button type="submit" className="">Login</button>
    //                 </form>
    //             </div>
    //         </div>
    //     </>
    // );

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Login</CardTitle>
                        <CardDescription className="text-center">
                            Entre com suas credenciais para acessar sua conta
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {errorMessage && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password">Senha</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required 
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </div>
    )

};
