export const login = async (email: string, password: string) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return null;
    } 
}