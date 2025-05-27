import Header from '../Header/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../../Services/ProductService';
import { TipoProduto } from '../../Enums/TipoProduto';
import styles from './TypeProduct.module.css';
import imgExp from '../../assets/images/13109.png';
import imgAcademic from '../../assets/images/13110.png';
import imgCourse from '../../assets/images/13111.png';
import imgOther from '../../assets/images/13112.png';
// import Modal from "../Modal/ProductModal";
interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
}

interface TypeProductProps {
    cartItems: Product[];
    setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
    toggleCart: () => void;
    isCartOpen: boolean;
}

const TypeProduct = ({ cartItems, setCartItems, toggleCart, isCartOpen }: TypeProductProps) => {
    const { tipo } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct ] = useState<Product>();

    const imageMap: { [key: number]: string } = {
        [TipoProduto.Curso]: imgCourse,
        [TipoProduto.Experiência]: imgExp,
        [TipoProduto.Acadêmico]: imgAcademic,
        [TipoProduto.Outro]: imgOther,
    };

    const tipoProdutoMap: { [key: number]: string } = {
        [TipoProduto.Acadêmico]: "Formação Acadêmica",
        [TipoProduto.Experiência]: "Experiência",
        [TipoProduto.Curso]: "Certificação",
        [TipoProduto.Outro]: "Outro"
    };

    const handleProductClick = async (id: number) => {
        localStorage.setItem("id", id.toString());
        const product = products.find( product => product.id === id);
        setSelectedProduct(product);
        // setIsModalOpen(true);
    }

    const handleAddToCart = (product: Product) => {
        const isAlreadyInCart = cartItems.some(item => item.id === product.id);
        if (isAlreadyInCart) {
            alert('Produto já está no carrinho!');
            return;
        }
        setCartItems([...cartItems, product]);
    };


    useEffect(() => {
        const fetchProducts = async () => {
            if (!tipo || isNaN(parseInt(tipo))) {
                console.error("Tipo de produto inválido na URL:", tipo);
                return;
            }

            try {
                const data = await getProducts();
                setProducts(data);
                if (tipo) {
                    const tipoNumber = parseInt(tipo);
                    const filtered = data.filter((p: Product) => p.tipo === tipoNumber);
                    setFilteredProducts(filtered);
                }
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProducts();
    }, [tipo]);

    return (
        <>
        <Header 
            toggleCart={toggleCart} 
            cartItems={cartItems}
            isCartOpen={isCartOpen} 
            setCartItems={setCartItems}
        />
        <div className='flex flex-row p-5 gap-5 flex-wrap justify-center'>
            {filteredProducts.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
            ) : (
                
                filteredProducts.map(p => (
                            <div className={`carousel-item ${styles.card}`} key={p.id}>
                                <div className="card-body flex flex-col items-center">
                                    <div id="image" onClick={() => handleProductClick(p.id)}>
                                        <img src={imageMap[p.tipo]} alt="Course image"/>
                                    </div>
                                    <div id="name">
                                        <h2 title={p.nome}>
                                        {p.nome.length > 20 ? p.nome.substring(0, 20) + '...' : p.nome}
                                        </h2>

                                    </div>
                                    <button className="rounded btn" onClick={() => handleAddToCart(p)}>Adicionar ao carrinho</button>
                                </div>
                            </div>
                ))
            )}
        </div>
            <input type="checkbox" id="product-modal" className="modal-toggle" checked={!!selectedProduct} readOnly />
                <label htmlFor="product-modal" className="modal cursor-pointer bg-white/80" onClick={() => setSelectedProduct(undefined)}>
                    <label className="modal-box relative" htmlFor="">
                        {selectedProduct && (
                            <>
                            <h2 className="text-2xl font-bold mb-4">{selectedProduct.nome}</h2>

                            <div className="mb-3">
                                <span className="font-semibold">Categoria: </span>
                                <span>{tipoProdutoMap[selectedProduct.tipo]}</span>
                            </div>

                            <div className="mb-5">
                                <span className="font-semibold">Descrição:</span>
                                <p className="mt-1 max-h-40 overflow-auto text-justify">
                                    {selectedProduct.descricao}
                                </p>
                            </div>

                            <a 
                                href={selectedProduct.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 w-fit"
                            >
                                Ver Arquivo
                            </a>
                            </>
                        )}
                        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setSelectedProduct(undefined)}>✕</button>
                    </label>
                </label>
        {/* {isModalOpen && selectedProduct &&(
               <Modal onClose={() => setIsModalOpen(false)}>
                   <div className={`${styles.mdDiv}`}>
                       <h2 className="text-2xl font-bold mb-4">{selectedProduct.nome}</h2>

                       <div className="mb-3">
                           <span className="font-semibold">Categoria: </span>
                           <span>{tipoProdutoMap[selectedProduct.tipo]}</span>
                       </div>

                       <div className="mb-5">
                           <span className="font-semibold">Descrição:</span>
                           <p className="mt-1 max-h-40 overflow-auto text-justify">
                               {selectedProduct.descricao}
                           </p>
                       </div>

                       <a 
                           href={selectedProduct.fileUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 w-fit"
                       >
                           Ver Arquivo
                       </a>
                   </div>
               </Modal>
        )} */}
        </>
    );
};

export default TypeProduct;
