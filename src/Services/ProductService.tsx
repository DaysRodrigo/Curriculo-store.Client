const apiUrl = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
    try {
        const response = await fetch(`${apiUrl}/api/produtos/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
    }
};

export const getProductById = async (id: number) => {
    try {
        const response = await fetch(`${apiUrl}/api/produtos/${id}`);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return null;
    }
};

export const createProduct = async (product: object) => {
    try {
        const response = await fetch(`${apiUrl}/api/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });

        if(!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        console.log("Produto criado com sucesso", response);
        return response;
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return null;
    }
};

export const updateProduct = async (product: object, id: number) => {
    try {
        const response = await fetch(`${apiUrl}/api/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        console.log("Produto atualizado com sucesso", response);
        return response;
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return null;
    }
};

export const deleteProduct = async (id: number) => {
    try {
        const response = await fetch(`${apiUrl}/api/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        console.log("Produto excluído com sucesso: ", response);
        return response;
    } catch (error) {
        console.error("Erro ao excluir produto: ", error);
        return null;
    }
};