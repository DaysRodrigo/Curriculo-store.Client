/**
 * @jest-environment node
 */
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '@/Services/ProductService';
import { login } from '@/Services/LoginService';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '@/config/__mocks__/api';

jest.mock('@/config/api', () => ({
  API_URL: 'http://localhost:5001',
}));


describe('Integration - Front/Back - ProductService', () => {

    beforeAll(async () => {
        //Login
        const email = TEST_USER_EMAIL;
        const password = TEST_USER_PASSWORD;
        const loginResult = await login(email!, password!);
        const token = loginResult?.token;


        if (!token){
            const raw = await fetch(`${process.env.API_URL || 'http://localhost:5001'}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const json = await raw.json();
            const tokenRaw = await json?.token;

            localStorage.setItem('authToken', tokenRaw);
        } else {
            localStorage.setItem('authToken', token);
        }

    })

    it('Create -> Read -> Update -> Delete', async () => {

        // Read All
        const result = await getProducts();
        expect(Array.isArray(result)).toBe(true);
        console.log('Products List:', result);

        //Create
        const fakeProduct = {
            nome: `Product Test ${Date.now()}`,
            tipo: 1,
            descricao: 'Description 2',
            instituicao: 'Institution 2',
            valor: 200,
            periodo: '2022-01-01',
            tecnologias: ['Tech 1', 'Tech 2']
        };
        const crtResult = await createProduct(fakeProduct);
        const created = crtResult && typeof crtResult.json === 'function'
            ? await crtResult.json()
            : crtResult; 

        const id = created?.id;
        const createdId = id;
        expect(created).toEqual(expect.objectContaining({ nome: fakeProduct.nome, id: createdId }));

        //Get Product By Id
        const productTest = await getProductById(createdId);
        expect(productTest).toEqual(expect.objectContaining({ id: createdId }));

        //Update
        const fakeProductUpdt = {
            nome: `Product Test ${Date.now()} - Updated`,
            tipo: 1,
            descricao: 'Description 2',
            instituicao: 'Institution 2',
            valor: 200,
            periodo: '2022-01-01',
            tecnologias: ['Tech 1', 'Tech 2']
        };

        const updtResult = await updateProduct(fakeProductUpdt, productTest!.id);
        const updated = updtResult && typeof updtResult.json === 'function'
            ? await updtResult.json()
            : updtResult;

        expect(updated).toEqual(expect.objectContaining({ nome: fakeProductUpdt.nome, id: productTest!.id }));

        //Delete
        const delResult = await deleteProduct(createdId);
        expect(delResult).not.toBeNull();

    });
});