import { useEffect } from "react";
import { TipoProduto } from "../../Enums/TipoProduto";
import { useNavigate } from "react-router-dom";
import styles from './Header.module.css';


interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
}

interface HeaderProps {
    toggleCart: () => void;
    isCartOpen: boolean;
    cartItems: Product[];
    setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Header = ({ toggleCart, cartItems, isCartOpen, setCartItems }: HeaderProps) => {
    const navigate = useNavigate();
    const handleRemove = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };
    const filterByType = (tipo: TipoProduto ) => {
        navigate(`/product/${tipo}`);
    };

    useEffect(() => {

    }, []);

    return (
        <>
            <header className="navbar">
                <div className="join gap-40">
                    <button onClick={() => filterByType(TipoProduto.Acadêmico)} className={`join-item `}>Formação Acadêmica</button>
                    <button onClick={() => filterByType(TipoProduto.Experiência)} className={`join-item `}>Experiência</button>
                    <button onClick={() => filterByType(TipoProduto.Curso)} className={`join-item `}>Certificações</button>
                    <button onClick={() => filterByType(TipoProduto.Outro)} className={`join-item `}>Outros</button>
                    <button className="btn btn-ghost btn-circle" onClick={toggleCart}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black hover:text-cyan-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                        {cartItems.length > 0 && (
                            <span className="badge badge-sm badge-primary">{cartItems.length}</span>
                        )}
                    </button>
                </div>
            </header>

                  <input type="checkbox" id="cart-modal" className="modal-toggle" checked={isCartOpen} readOnly />
      <div className="modal">
        <div className="modal-box max-w-lg relative">
          <label 
            htmlFor="cart-modal" 
            className="btn btn-sm btn-circle absolute right-2 top-2" 
            onClick={toggleCart}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Carrinho de Compras</h3>

          {cartItems.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {cartItems.map(item => (
                <li key={item.id} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.nome}</p>
                    <p className="text-sm text-gray-500">{item.descricao.substring(0, 40)}...</p>
                  </div>
                  <button 
                    className="btn btn-xs btn-error"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="modal-action">
            <button className="btn btn-primary" onClick={toggleCart}>Fechar</button>
          </div>
        </div>
      </div>
        </>
    );

}

export default Header;