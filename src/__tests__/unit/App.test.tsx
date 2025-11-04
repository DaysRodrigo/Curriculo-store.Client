import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

jest.mock('@/config/api', () => ({
  API_URL: 'http://localhost:5001',
}));

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

describe('App Component', () => {

  it('Should render App component', async () => {
    render(<App />);
    expect(await screen.findByText(/conceptual/i)).toBeInTheDocument();
  })
});
