import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '@/Services/ProductService';
import { API_URL } from '@/config/api';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve([
                { id: 1, name: 'Produto 1' },
                { id: 2, name: 'Produto 2' },
            ]),
    })
) as jest.Mock;

jest.mock('@/config/api', () => ({
  API_URL: 'http://localhost:5001',
}));

describe('getAllProducts', () => {

    it('Should fetch and return array of products', async () => {
        //Arrange
        const fakeProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(fakeProducts)
        });
    
        //Act
        const result = await getProducts();
        
        //Assert
        expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/produtos/all`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        }
        );
        expect(Array.isArray(result)).toBe(true);
    });

    it('Should throw an error when getProducts fails', async () => {
        //Arrange
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce({ message: 'Failed to get products' })
        });

        //Act
        const result = await getProducts();

        //Assert
        expect(result).toEqual([]);
    });
});

describe('getProductById', () => {


    it('Sould fetch and return a product by id', async () => {
        //Arrange
        const fakeProduct = { id: 1, name: 'Product 1' };
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: jest.fn().mockResolvedValueOnce(fakeProduct)
        });
    
        //Act
        const result = await getProductById(fakeProduct.id);
    
        //Assert
        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/api/produtos/1`,
            {
                method: "GET",
                headers: {"Content-Type": "application/json"},
                credentials: "include"
            }
        );
        expect(result).toEqual(fakeProduct);
    });

    it('Should throw an error when getProductById fails', async () => {
        //Arrange
        const fakeProduct = { id: 1, name: 'Product 1' };
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce(fakeProduct)
        });

        //Act
        const result = await getProductById(fakeProduct.id);

        //Assert
        expect(result).toBeNull();
    });
});

describe('createProduct', () => {

    it('Sould create a new product', async () => {
        //Arrange
        const fakeProduct = [{ id: 1, name: 'Product 1' }];
        const fakeResponse = {
            ok: true,
            status: 201,
            json: jest.fn().mockResolvedValueOnce(fakeProduct)
        };
        (fetch as jest.Mock).mockResolvedValueOnce(fakeResponse);

        //Act
        const result = await createProduct(fakeProduct);

        //Assert
        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/api/produtos`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fakeProduct)
            }
        );
        expect(result).toEqual(fakeResponse);
    });

    it('Should throw an error when createProduct fails', async () => {
        //Arrange
        const fakeProduct = [{ id: 1, name: 'Product 1' }];

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce(fakeProduct)
        });

        //Act
        const result = await createProduct(fakeProduct);

        //Assert
        expect(result).toBeNull();
    })
});

describe('updateProduct', () => {

    it('Should update a product', async () => {
        //Arrange
        const fakeProduct = { id: 1, name: 'Product 1'};
        const fakeResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(fakeProduct)
        };
        (fetch as jest.Mock).mockResolvedValueOnce(fakeResponse);

        //Act
        const result = await updateProduct(fakeProduct, fakeProduct.id);

        //Assert
        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/api/produtos/1`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fakeProduct)
            }
        );
        expect(result).toEqual(fakeResponse);
    });

    it('Should throw an error when updateProduct fails', async () => {
        //Arrange
        const fakeProduct = { id: 1, name: 'Product 1' };
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce(fakeProduct)
        });

        //Act
        const result = await updateProduct(fakeProduct, fakeProduct.id);

        //Assert
        expect(result).toBeNull();
    })
});

describe('deleteProduct', () => {

    it('Should delete a product', async () => {
        //Arrange
        const fakeProduct = { id: 1, name: 'Product 1'};
        const fakeResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce({})
        };
        (fetch as jest.Mock).mockResolvedValueOnce(fakeResponse);

        //Act
        const result = await deleteProduct(fakeProduct.id);

        //Assert
        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/api/produtos/1`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json'}
            }
        );
        expect(result).toEqual(fakeResponse);
    });

    it('Should throw an error when deleteProduct fails', async () => {
        //Arrange
        const fakeProduct = { id: 1, name: 'Product 1'};
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce({})
        });

        //Act
        const result = await deleteProduct(fakeProduct.id);

        //Assert
        expect(result).toBeNull();
    })
})