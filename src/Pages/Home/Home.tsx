import { useEffect, useState } from "react";
import { getProducts } from "../../Services/ProductService";
import '../../Styles/Global.css';
import styles from './Home.module.css';
import imgAbout from '../../assets/images/13105c.png';
import imgExp from '../../assets/images/13109.png';
import imgAcademic from '../../assets/images/13110.png';
import imgCourse from '../../assets/images/13111.png';
import imgOther from '../../assets/images/13112.png';
import { TipoProduto } from "../../Enums/TipoProduto";
// import Modal from "../Modal/ProductModal";
import Header from "../Header/Header";


interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
}

interface HomeProps {
    cartItems: Product[];
    setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
    toggleCart: () => void;
    isCartOpen: boolean;
}
const Home = ({ cartItems, setCartItems, toggleCart, isCartOpen }: HomeProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    useEffect(() => {
        const getProduct = async () => {
            const data = await getProducts();
            setProducts(data);
            setFilteredProducts(data);
        };

        getProduct();
    }, []);

    const handleProductClick = async (id: number) => {
        localStorage.setItem("id", id.toString());
        const product = products.find( product => product.id === id);
        setSelectedProduct(product);
        setIsModalOpen(true);
    }


    const handleCartClick = (productId: number) => {
          const productToAdd = products.find(p => p.id === productId);
          if (!productToAdd) return;

          if (cartItems.find(p => p.id === productId)) {
              alert('Produto já está no carrinho!');
              return;
          }
        setCartItems(prev => [...prev, productToAdd]);
    }

    return (
        <>
        <Header 
            toggleCart={toggleCart} 
            cartItems={cartItems}
            isCartOpen={isCartOpen} 
            setCartItems={setCartItems}
        />
            <div className="flex justify-center justify-items-center h-96 about-me p-5">
                <div className={`${styles.aboutCard}`}>
                    <h3>Um pouco sobre mim:</h3>
                    <p className="p-1 m-1">
                        Me chamo Rodrigo Dias Sales, tenho 31 anos e sou do Rio de Janeiro.
                        Tenho por volta de 4 anos de experiência na área de tecnologia,
                        fui estagiário por um ano e depois trabalhei como desenvolvedor júnior por 3 anos.
                        Nesse momento estou procurando um oportunidade de evoluir mais e mostrar meu valor.
                        Seguindo esse projeto, você vai poder ver com o que trabalhei, e o que eu gostaria de trabalhar.
                    </p>
                </div>
            </div>
             <div className="navbar shadow-sm flex-grow flex flex-col products-section">
                <div className={`${styles.carousel} gap-4 p-5`}>
                        {filteredProducts.map((product) => (
                            <div className={`carousel-item ${styles.card}`} key={product.id}>
                                <div className="card-body flex flex-col items-center">
                                    <div id="image" onClick={() => handleProductClick(product.id)}>
                                        <img src={imageMap[product.tipo]} alt="Course image"/>
                                    </div>
                                    <div id="name">
                                        <h2 title={product.nome}>
                                        {product.nome.length > 20 ? product.nome.substring(0, 20) + '...' : product.nome}
                                        </h2>

                                    </div>
                                    <button className="rounded btn" onClick={() => handleCartClick(product.id)}>Adicionar ao carrinho</button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className={`flex mt-10`}>
                <div className={`${styles.aboutContent}`}>
                    <img className={`${imgAbout}`} src={imgAbout}></img>
                </div>
                <div className={`${styles.aboutCard}`}>
                    <h3>Sobre o projeto:</h3>
                    <p className="p-1 m-1">A idéia surgiu de uma necessidade de montar uma projeto onde eu
                        pudesse mostrar uma grande parte do que sei e trabalhei, junto com algo que nunca fiz.
                        Como eu já queria fazer um currículo online, e nunca tinha feito nada parecido com um
                        marketplace, pensei em juntar os dois.
                        O foco do projeto é simular uma loja com o meu currículo.
                        Onde os itens do meu currículo são os produtos, como formação acadêmica, 
                        experiência, certificações e outros.
                        O projeto foi feito em React, TypeScript e Tailwind CSS no front,
                        e .Net no back. Também utilizei banco PostGree Sql e AWS para salvar os arquivos.
                    </p>
                </div>
            </div>
            <input
                type="checkbox"
                id="product-modal"
                className="modal-toggle"
                checked={!!selectedProduct}
                readOnly
            />
            <label
                htmlFor="product-modal"
                className="modal cursor-pointer"
                onClick={() => setSelectedProduct(undefined)}
            >
                <label className="modal-box relative bg-white/80" htmlFor="">
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
                    <button
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                        onClick={() => setSelectedProduct(undefined)}
                    >
                        ✕
                    </button>
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

export default Home;