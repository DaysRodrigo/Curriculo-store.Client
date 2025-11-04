import { login } from '@/Services/LoginService';
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

describe('login', () => {

    it('Should fetch and return user data', async () => {
        //Arrange
        const fakeUser = { id: 1, name: 'User 1'};
        const fakeEmail = 'user1@example.com';
        const fakePassword = 'password123';

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(fakeUser)
        });

        //Act
        const result = await login(fakeEmail, fakePassword);

        //Assert
        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/api/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: fakeEmail, password: fakePassword }),
                credentials: 'include'
            }
        );
        expect(result).toEqual(fakeUser);
    });

    it('Should throw an error if login fails', async () =>{
        //Arrange
        const fakeEmail = 'user1@example.com';
        const fakePassword = 'wrongpassword';

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: jest.fn().mockResolvedValueOnce({ message: 'Invalid credentials' })
        });

        //Act
        const result = await login(fakeEmail, fakePassword);
        
        //Assert
        expect(result).toBeNull();
    });
});