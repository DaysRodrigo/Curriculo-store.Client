import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('@/config/api', () => ({
  API_URL: 'http://localhost:5001',
}));

test('renderiza texto principal', async () => {
  render(<App />);
  expect(await screen.findByText(/conceptual/i)).toBeInTheDocument();
  
});
