import React, { useEffect, useState } from "react";
import { getProducts } from "../../Services/ProductService";
import '../../Styles/Global.css';
import styles from './Home.module.css';
import imgAbout from '../../assets/images/13105.jpg';
import imgExp from '../../assets/images/13109.png';
import imgAcademic from '../../assets/images/13110.png';
import imgCourse from '../../assets/images/13111.png';
import imgOther from '../../assets/images/13112.png';
import { TipoProduto } from "../../Enums/TipoProduto";
import Modal from "../Modal/ProductModal";


interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
}


const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct ] = useState<Product>();


    const filterByType = (tipo: TipoProduto | "Todos") => {
        if (tipo === "Todos") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(p => p.tipo === tipo);
            setFilteredProducts(filtered);
        }
    };

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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = products.filter(product =>
            product.nome.toLowerCase().includes(searchTerm)
        );
        setFilteredProducts(filtered);
    }


    return (
        <>
            <div className="bg-yellow-50 flex justify-center justify-items-center h-96 about-me p-5">
                <div className="card h-full shadow-2 p-2 about-content">
                    <h3>Um pouco sobre mim:</h3>
                    <p className="p-1 m-1">
                        Me chamo Rodrigo Dias Sales, tenho 31 anos e sou do Rio de Janeiro.
                        Tenho por volta de 4 anos de experiência na área de tecnologia,
                        fui estagiário por um ano e depois trabalhei como desenvolvedor júnior por 3 anos.
                        Nesse momento estou procurando um oportunidade de evoluir mais e mostrar meu valor.
                        Seguindo esse projeto, você vai poder ver um pouco do meu trabalho e o que eu já fiz.
                    </p>
                </div>
            </div>
            <div className="navbar shadow-sm flex-grow flex flex-col products-section">
                <div className="join gap-40">
                    <button onClick={() => filterByType(TipoProduto.Acadêmico)} className="join-item btn type-button">Formação Acadêmica</button>
                    <button onClick={() => filterByType(TipoProduto.Experiência)} className="join-item btn type-button">Experiência</button>
                    <button onClick={() => filterByType(TipoProduto.Curso)} className="join-item btn type-button">Certificações</button>
                    <button onClick={() => filterByType(TipoProduto.Outro)} className="join-item btn type-button">Outros</button>
                    <button onClick={() => filterByType("Todos")} className="join-item btn type-button">Todos</button>
                </div>

                <div className="navbar shadow-sm">
                    <div className="flex items-center w-full gap-4">
                        <label className="input flex-grow flex items-center gap-2 bg-white rounded-md px-3 py-2">
                            <svg className="h-[1em] text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke-width="2.5"
                                fill="none"
                                stroke="currentColor"
                                >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input onChange={handleSearch} type="search" className="grow" placeholder="Search" />
                        </label>

                            <button className="btn btn-ghost btn-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black hover:text-white" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                            </button>
                    </div>
                </div>
                <div className="carousel gap-4 p-5">
                        {filteredProducts.map((product) => (
                            <div className="carousel-item card w-96 shadow-xl" key={product.id}>
                                <div className="card-body flex flex-col items-center"
                                    onClick={() => handleProductClick(product.id)}>
                                    <div id="image">
                                        <img src={imageMap[product.tipo]} alt="Course image"/>
                                    </div>
                                    <div id="name">
                                        <h2 className="card-title">{product.nome}</h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="bg-yellow-50 flex mt-10">
                <div className="p-5 about-content">
                    <img className="imgAbout" src={imgAbout}></img>
                </div>
                <div className="card h-full shadow-2 p-5 about-content">
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
            {isModalOpen && selectedProduct &&(
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
           )}
        </>
    );
};

export default Home;