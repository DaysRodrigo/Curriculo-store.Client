import React from "react";
import "../../Styles/Global.css";
import styles from "./Crud.module.css";
import { TipoProduto } from "../../Enums/TipoProduto";
import { useEffect, useState } from "react";
import { uploadFile } from "../../Services/CloudService";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../Services/ProductService";


interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
}

const Crud = () => {
    const [name, setName] = React.useState("");
    const [nameUpdt, setNameUpdt] = React.useState("");
    const [nameDlt, setNameDlt] = React.useState("");
    const [type, setType] = useState<TipoProduto | "">("");
    const [typeUpdt, setTypeUpdt] = useState<TipoProduto | "">("");
    const [description, setDescription] = React.useState("");
    const [descriptionUpdt, setDescriptionUpdt] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);
    const [updateFile, setUpdateFile] = useState<File | null>(null);
    const [newUrl, setnewUrl] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [errorMessageUpdt, setErrorMessageUpdt] = React.useState<string | null>(null);
    const [errorMessageDlt, setErrorMessageDlt] = React.useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");
    const [ dltProductId, setDltProductId] = useState<number | "">("");


    const handleIdChange = async (selectedProduct: Product) => {
        localStorage.setItem("selectedId", String(selectedProduct.id));
    }
    
    useEffect(() => {
        const getProduct = async () => {
            const data: Array<Product> = await getProducts();
            setProducts(data);
        };

        getProduct();
    }, []);
    
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || description.trim() === "" || type === "" ) {
            setErrorMessage(null);
            setErrorMessage("Preencha todos os campos obrigatórios.");
            return;
        }

        if ((type === 0 || type === 2) && !file) {
            setErrorMessage(null);
            setErrorMessage("Para este tipo, é necessário fornecer um arquivo.");
            return;
        }

        try {
            let data: object = {
                nome: name,
                tipo: type,
                descricao: description,
            };

            if ( file ) {
                const publicUrl = await uploadFile(file);
                setnewUrl(publicUrl);
                data = {
                    nome: name,
                    tipo: type,
                    descricao: description,
                    fileurl: publicUrl,
                };
            }
            const response = await createProduct(data);
            if (response &&  response.status === 200) {
                console.log("Produto criado com sucesso");
            } else {
                setErrorMessage(null);
                setErrorMessage("Erro ao criar produto");
            }
        } catch (error: any) {
            setErrorMessage(null);
            setErrorMessage("Erro ao criar produto" + error.message);
        }
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nameUpdt || typeUpdt === "" || !updateFile || !descriptionUpdt) {
            setErrorMessageUpdt(null);
            setErrorMessageUpdt("Preencha todos os campos");
            return;
        }

        try {
            const publicUrl = await uploadFile(updateFile);
            setPreviewUrl(publicUrl);
            const id = Number(localStorage.getItem('selectedId'));
            const data: object = {
                Nome: nameUpdt,
                Tipo: typeUpdt,
                fileurl: publicUrl,
                Descricao: descriptionUpdt,
            }
            
            const response = await updateProduct(data, id);
            if (response && response.status === 200) {
                console.log("Produto atualizado com sucesso");
            } else {
                setErrorMessageUpdt(null);
                setErrorMessageUpdt("Erro ao atualizar o produto");
            }
        } catch (error: any) {
            setErrorMessageUpdt(null);
            setErrorMessageUpdt("Erro ao atualizar o produto" + error.message);
        }
    }

    const handleDlt = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!dltProductId) {
            setErrorMessageDlt(null);
            setErrorMessageDlt("Selecione o produto");
            return;
        }
        try {
            const id = Number(dltProductId);
            const response = await deleteProduct(id);
            if (response && response.status === 200) {
                console.log("Produto excluído com sucesso");
            } else {
                setErrorMessageDlt(null);
                setErrorMessageDlt("Erro ao excluir produto");
            }
        } catch (error: any) {
            setErrorMessageDlt(null);
            setErrorMessageDlt("Erro ao excluir produto" + error.message);
        }
    }

    return (
        <>
        <section className="bg-yellow-50 flex flex-row justify-center justify-items-center">
                <div className={`${styles.cardCrud} flex flex-col flex-1`}>
                    {errorMessage && (<div className="text-red-500 text-sm p-1">{errorMessage}</div>)}
                    <form className={`flex flex-col`} onSubmit={handleCreate}>
                        <h2 className="text-black text-base">Cadastro de Produtos</h2>
                        <label className="text-black" htmlFor="name">Nome</label>
                        <input type="text" id="name" name="name" className={` p-1 m-1 rounded`} 
                        onChange={e => setName(e.target.value)} value={name} />
                        <label className="text-black" htmlFor="type">Tipo</label>
                        <select id="type" name="type" className={` p-1 m-1 rounded`}
                        onChange={e => setType(e.target.value === "" ? "" : Number(e.target.value) as TipoProduto)} value={type}>
                                <option value="">Selecione um tipo</option>
                                { Object.entries(TipoProduto).map(([label, value]) => (
                                    <option key={value} value={value}>
                                    {label}
                                    </option>
                                ))}
                        </select>
                        <label className="text-black" htmlFor="description">Descrição</label>
                        <textarea id="description" name="description" className={` p-7 m-1 rounded`}
                        onChange={e => setDescription(e.target.value)} value={description} /> 
                        <label className="text-black" htmlFor="fileurl">Arquivo</label>
                        <input type="file" id="fileurl" name="fileurl" className={` p-1 m-1 rounded`}
                        onChange={e => {
                        const selectedFile = e.target.files?.[0];
                            if (selectedFile) {
                                setFile(selectedFile);
                            }
                        }} />
                        <button type="submit" className={`${styles.buttonCreate} p-2 rounded`}>Enviar</button>
                    </form>
                </div>
                <div className={`${styles.cardCrud} flex flex-col flex-2`}>
                    {errorMessageUpdt && (<div className="text-red-500 text-sm p-1">{errorMessageUpdt}</div>)}
                    <form className={`flex flex-col`} onSubmit={handleUpdate}>
                        <h2 className="text-black text-base">Atualização de Produtos</h2>
                        <label className="text-black" htmlFor="products">Selecione o produto para atualizar:</label>
                        <select id="products" name="products" className={` p-1 m-1 rounded`}
                        onChange={e => { const id = e.target.value ? Number(e.target.value) : "";
                            setSelectedProductId(id);
                            const selectedProduct = products.find(product => product.id === id);
                            if (selectedProduct) {
                                handleIdChange(selectedProduct)
                                setNameUpdt(selectedProduct.nome);
                                setTypeUpdt(Number(selectedProduct.tipo) as TipoProduto);
                                setDescriptionUpdt(selectedProduct.descricao);
                                setPreviewUrl(selectedProduct.fileUrl);
                            }
                        }}
                        value={selectedProductId}
                        >
                                <option value="" disabled>Selecione um produto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.nome}
                                    </option>
                                ))}
                        </select>
                        <label className="text-black" htmlFor="nameUpdt">Nome</label>
                        <input type="text" id="nameUpdt" name="nameUpdt" className={` p-1 m-1 rounded`} 
                        onChange={e => setNameUpdt(e.target.value)} value={nameUpdt} />
                        <label className="text-black" htmlFor="typeUpt">Tipo</label>
                        <select id="typeUpt" name="typeUpt" className={` p-1 m-1 rounded`}
                        onChange={e => setTypeUpdt(e.target.value === "" ? "" : Number(e.target.value) as TipoProduto)} value={typeUpdt}>
                                <option value="">Selecione um tipo</option>
                                { Object.entries(TipoProduto).map(([label, value]) => (
                                    <option key={value} value={value}>
                                    {label}
                                    </option>
                                ))}
                        </select>
                        <label className="text-black" htmlFor="descriptionUpdt">Descrição</label>
                        <textarea id="descriptionUpdt" name="descriptionUpdt" className={` p-7 m-1 rounded`}
                        onChange={e => setDescriptionUpdt(e.target.value)} value={descriptionUpdt} /> 
                        <label className="text-black" htmlFor="previewUrl">Arquivo</label>
                        {previewUrl && (
                            <div className="mt-2">
                                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                                Visualizar arquivo atual
                                </a>
                            </div>
                        )}
                        <input type="file" id="previewUrl" name="previewUrl" className={` p-1 m-1 rounded`}
                        onChange={e => {
                        const selectedFile = e.target.files?.[0];
                            if (selectedFile) {
                                setUpdateFile(selectedFile);
                            }
                        }} />
                        <button type="submit"  className={`${styles.buttonCreate} p-2 rounded`}>Enviar</button>
                    </form>
                </div>
                <div className={`${styles.cardCrud} flex flex-col flex-1`}>
                    {errorMessageDlt && (<div className="text-red-500 text-sm p-1">{errorMessageDlt}</div>)}
                    <form className={`flex flex-col`} onSubmit={handleDlt}>
                        <h2 className="text-black text-base">Exclusão de Produtos</h2>
                        <label className="text-black" htmlFor="productsDlt">Selecione o produto para ser removido:</label>
                        <select id="productsDlt" name="productsDlt" className={` p-1 m-1 rounded`}
                        onChange={e => { const id = e.target.value ? Number(e.target.value) : "";
                            setDltProductId(id);
                            const selectedProductDlt = products.find(product => product.id === id);
                            if (selectedProductDlt) {
                                setNameDlt(selectedProductDlt.nome);
                            }
                        }}
                        value={dltProductId}
                        >
                                <option value="" disabled>Selecione um produto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.nome}
                                    </option>
                                ))}
                        </select>
                        <label className="text-black" htmlFor="nameDlt">Nome</label>
                        <input type="text" id="nameDlt" name="nameDlt" className={` p-1 m-1 rounded`} 
                        onChange={e => setNameDlt(e.target.value)}  value={nameDlt} />
                        <button type="submit"  className={`${styles.buttonCreate} p-2 rounded`}>Enviar</button>
                    </form>
                </div>
        </section>
        </>
    );
};

export default Crud;