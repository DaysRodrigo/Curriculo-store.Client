import { API_URL } from "@/config/api";



export const login = async (email: string, password: string) => {
    try {
        let localEmail = email;
        let localPassword = password;
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: localEmail, password: localPassword }),
            credentials: 'include'
        });

        localEmail = '';
        localPassword = '';

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {

        console.error("Erro ao fazer login:", error);
        if (process.env.NODE_ENV === 'development') {
            console.error("Erro ao fazer login:", error);
        } else {
            console.error("Erro ao fazer login");
        }
        return null;
    } 
}