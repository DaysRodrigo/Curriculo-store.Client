import React, { useEffect, useState } from "react";
import { TipoProduto } from "@/Enums/TipoProduto";
import { uploadFile } from "@/Services/CloudService";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/Services/ProductService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Car, ExternalLink, Upload } from "lucide-react";

interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
}

export function Crud () {
    //Create
    const [name, setName] = React.useState("");
    const [type, setType] = useState<TipoProduto | "">("");
    const [description, setDescription] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    //Update
    const [nameUpdt, setNameUpdt] = React.useState("");
    const [typeUpdt, setTypeUpdt] = useState<TipoProduto | "">("");
    const [descriptionUpdt, setDescriptionUpdt] = React.useState("");
    const [updateFile, setUpdateFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");
    const [isUpdating, setIsUpdating] = useState(false);

    //Delete
    const [nameDlt, setNameDlt] = React.useState("");
    const [dltProductId, setDltProductId] = useState<number | "">("");
    const [isDeleting, setIsDeleting] = useState(false);

    //General
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();

    const handleIdChange = async (selectedProduct: Product) => {
        localStorage.setItem("selectedId", String(selectedProduct.id));
    }
    
    useEffect(() => {
        // const getProduct = async () => {
        //     const data: Array<Product> = await getProducts();
        //     setProducts(data);
        // };

        // getProduct();

        const getProduct = async () => {
            try {
                setIsLoading(true);
                const data: Array<Product> = await getProducts();
                setProducts(data);
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Erro ao carregar produtos. " + error.message
                });
            } finally {
                setIsLoading(false);
            }
        };

        getProduct();
    }, [toast]);
    
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || description.trim() === "" || type === "" ) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha todos os campos obrigatórios"
            });
            return;
        }

        if ((type === 0 || type === 2) && !file) {
            toast({
                variant: "destructive",
                title: "Arquivo necessário",
                description: "Para este tipo, é necessário fornecer um arquivo"
            });
            return;
        }

        try {
            setIsCreating(true);
            let data: any = {
                nome: name,
                tipo: type,
                descricao: description,
            };

            if ( file ) {
                const publicUrl = await uploadFile(file);
                data.fileUrl = publicUrl;
                // data = {
                //     nome: name,
                //     tipo: type,
                //     descricao: description,
                //     fileurl: publicUrl,
                // };
            }
            const response = await createProduct(data);
            if (response &&  response.status === 200) {
                toast({
                    title: "Sucesso",
                    description: "Produto criado com sucesso."
                });

                //Reset Form
                setName("");
                setType("");
                setDescription("");
                setFile(null);

                //Reload products
                const updateProducts = await getProducts();
                setProducts(updateProducts);
            } else {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao criar produto"
            });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao criar produto: " + error.message
            });
        } finally {
            setIsCreating(false);
        }
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nameUpdt || typeUpdt === "" || !updateFile || !descriptionUpdt) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha todos os campos"
            });
            return;
        }

        try {
            setIsUpdating(true);
            const publicUrl = await uploadFile(updateFile);
            setPreviewUrl(publicUrl);
            const id = Number(localStorage.getItem('selectedId'));
            const data: any = {
                Nome: nameUpdt,
                Tipo: typeUpdt,
                fileurl: publicUrl,
                Descricao: descriptionUpdt,
            }
            
            const response = await updateProduct(data, id);
            if (response && response.status === 200) {
                toast({
                    title: "Sucesso",
                    description: "Produto atualizado com sucesso!"
                });

                //Reload products
                const updateProducts = await getProducts();
                setProducts(updateProducts);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Erro ao atualizar produto"
                });
            }
        } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Erro ao atualizar o produto: " + error.message
                });
        } finally {
            setIsUpdating(false);
        }
    }

    const handleDlt = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!dltProductId) {
            toast({
                variant: "destructive",
                title: "Seleção necessária",
                description: "Selecione o produto"
            });
            return;
        }
        try {
            setIsDeleting(true);
            const id = Number(dltProductId);
            const response = await deleteProduct(id);
            if (response && response.status === 200) {
                toast({
                    title: "Sucesso",
                    description: "Produto excluído com sucesso."
                });

                //Reset form
                setDltProductId("");
                setNameDlt("");

                //Reload products
                const updateProducts = await getProducts();
                setProducts(updateProducts);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Erro ao excluir produto"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao excluir produto: " + error.message
            });
        } finally {
            setIsDeleting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="nin-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg text-foreground">Carregando produtos...</div>
                </div>
            </div>
        );
    }
    // return (
    //     <>
    //     <section className="bg-yellow-50 flex flex-row justify-center justify-items-center">
    //             <div className="">
    //                 {errorMessage && (<div className="text-red-500 text-sm p-1">{errorMessage}</div>)}
    //                 <form className={`flex flex-col`} onSubmit={handleCreate}>
    //                     <h2 className="text-black text-base">Cadastro de Produtos</h2>
    //                     <label className="text-black" htmlFor="name">Nome</label>
    //                     <input type="text" id="name" name="name" className={` p-1 m-1 rounded`} 
    //                     onChange={e => setName(e.target.value)} value={name} />
    //                     <label className="text-black" htmlFor="type">Tipo</label>
    //                     <select id="type" name="type" className={` p-1 m-1 rounded`}
    //                     onChange={e => setType(e.target.value === "" ? "" : Number(e.target.value) as TipoProduto)} value={type}>
    //                             <option value="">Selecione um tipo</option>
    //                             { Object.entries(TipoProduto).map(([label, value]) => (
    //                                 <option key={value} value={value}>
    //                                 {label}
    //                                 </option>
    //                             ))}
    //                     </select>
    //                     <label className="text-black" htmlFor="description">Descrição</label>
    //                     <textarea id="description" name="description" className={` p-7 m-1 rounded`}
    //                     onChange={e => setDescription(e.target.value)} value={description} /> 
    //                     <label className="text-black" htmlFor="fileurl">Arquivo</label>
    //                     <input type="file" id="fileurl" name="fileurl" className={` p-1 m-1 rounded`}
    //                     onChange={e => {
    //                     const selectedFile = e.target.files?.[0];
    //                         if (selectedFile) {
    //                             setFile(selectedFile);
    //                         }
    //                     }} />
    //                     <button type="submit" className="">Enviar</button>
    //                 </form>
    //             </div>
    //             <div className="">
    //                 {errorMessageUpdt && (<div className="text-red-500 text-sm p-1">{errorMessageUpdt}</div>)}
    //                 <form className={`flex flex-col`} onSubmit={handleUpdate}>
    //                     <h2 className="text-black text-base">Atualização de Produtos</h2>
    //                     <label className="text-black" htmlFor="products">Selecione o produto para atualizar:</label>
    //                     <select id="products" name="products" className={` p-1 m-1 rounded`}
    //                     onChange={e => { const id = e.target.value ? Number(e.target.value) : "";
    //                         setSelectedProductId(id);
    //                         const selectedProduct = products.find(product => product.id === id);
    //                         if (selectedProduct) {
    //                             handleIdChange(selectedProduct)
    //                             setNameUpdt(selectedProduct.nome);
    //                             setTypeUpdt(Number(selectedProduct.tipo) as TipoProduto);
    //                             setDescriptionUpdt(selectedProduct.descricao);
    //                             setPreviewUrl(selectedProduct.fileUrl);
    //                         }
    //                     }}
    //                     value={selectedProductId}
    //                     >
    //                             <option value="" disabled>Selecione um produto</option>
    //                             {products.map((product) => (
    //                                 <option key={product.id} value={product.id}>
    //                                     {product.nome}
    //                                 </option>
    //                             ))}
    //                     </select>
    //                     <label className="text-black" htmlFor="nameUpdt">Nome</label>
    //                     <input type="text" id="nameUpdt" name="nameUpdt" className={` p-1 m-1 rounded`} 
    //                     onChange={e => setNameUpdt(e.target.value)} value={nameUpdt} />
    //                     <label className="text-black" htmlFor="typeUpt">Tipo</label>
    //                     <select id="typeUpt" name="typeUpt" className={` p-1 m-1 rounded`}
    //                     onChange={e => setTypeUpdt(e.target.value === "" ? "" : Number(e.target.value) as TipoProduto)} value={typeUpdt}>
    //                             <option value="">Selecione um tipo</option>
    //                             { Object.entries(TipoProduto).map(([label, value]) => (
    //                                 <option key={value} value={value}>
    //                                 {label}
    //                                 </option>
    //                             ))}
    //                     </select>
    //                     <label className="text-black" htmlFor="descriptionUpdt">Descrição</label>
    //                     <textarea id="descriptionUpdt" name="descriptionUpdt" className={` p-7 m-1 rounded`}
    //                     onChange={e => setDescriptionUpdt(e.target.value)} value={descriptionUpdt} /> 
    //                     <label className="text-black" htmlFor="previewUrl">Arquivo</label>
    //                     {previewUrl && (
    //                         <div className="mt-2">
    //                             <a href={previewUrl} target="_blank" rel="noopener noreferrer">
    //                             Visualizar arquivo atual
    //                             </a>
    //                         </div>
    //                     )}
    //                     <input type="file" id="previewUrl" name="previewUrl" className={` p-1 m-1 rounded`}
    //                     onChange={e => {
    //                     const selectedFile = e.target.files?.[0];
    //                         if (selectedFile) {
    //                             setUpdateFile(selectedFile);
    //                         }
    //                     }} />
    //                     <button type="submit"  className="">Enviar</button>
    //                 </form>
    //             </div>
    //             <div className="">
    //                 {errorMessageDlt && (<div className="text-red-500 text-sm p-1">{errorMessageDlt}</div>)}
    //                 <form className={`flex flex-col`} onSubmit={handleDlt}>
    //                     <h2 className="text-black text-base">Exclusão de Produtos</h2>
    //                     <label className="text-black" htmlFor="productsDlt">Selecione o produto para ser removido:</label>
    //                     <select id="productsDlt" name="productsDlt" className={` p-1 m-1 rounded`}
    //                     onChange={e => { const id = e.target.value ? Number(e.target.value) : "";
    //                         setDltProductId(id);
    //                         const selectedProductDlt = products.find(product => product.id === id);
    //                         if (selectedProductDlt) {
    //                             setNameDlt(selectedProductDlt.nome);
    //                         }
    //                     }}
    //                     value={dltProductId}
    //                     >
    //                             <option value="" disabled>Selecione um produto</option>
    //                             {products.map((product) => (
    //                                 <option key={product.id} value={product.id}>
    //                                     {product.nome}
    //                                 </option>
    //                             ))}
    //                     </select>
    //                     <label className="text-black" htmlFor="nameDlt">Nome</label>
    //                     <input type="text" id="nameDlt" name="nameDlt" className={` p-1 m-1 rounded`} 
    //                     onChange={e => setNameDlt(e.target.value)}  value={nameDlt} />
    //                     <button type="submit"  className="">Enviar</button>
    //                 </form>
    //             </div>
    //     </section>
    //     </>
    // );

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Product */ }
                <Card>
                    <CardHeader>
                        <CardTitle>Cadastro de Produtos</CardTitle>
                        <CardDescription>Crie um nvo produto no sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nome do produto"
                                />
                            </div>

                            <div>
                                <Label htmlFor="type">Tipo</Label>
                                <Select value={type === "" ? "" : type.id.toString()} onValueChange={(value) => setType(value === "" ? "" : TipoProduto.find(tipo => tipo.id === Number(value)) || "")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TipoProduto.map((tipo) => (
                                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <tipo.icon className="h-4 w-4"/>
                                                    {tipo.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea 
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descrição do produto"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <Label htmlFor="fileUrl">Arquivo</Label>
                                <Input 
                                    id="fileurl"
                                    type="file"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files?.[0];
                                        if (selectedFile) {
                                            setFile(selectedFile);
                                        }
                                    }}    
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? "Criando..." : "Criar Produto"}
                                <Upload className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Update Product */ }
                <Card>
                    <CardHeader>
                        <CardTitle>Atualização de Produtos</CardTitle>
                        <CardDescription>Edite um produtoe existente</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <Label htmlFor="products">Selecione o produto para atualizar</Label>
                                <Select value={selectedProductId.toString()} onValueChange={(value) => {
                                    const id = value ? Number(value) : "";
                                    setSelectedProductId(id);
                                    const selectedProduct = products.find(product => product.id === id);
                                    if (selectedProduct) {
                                        handleIdChange(selectedProduct);
                                        setNameUpdt(selectedProduct.nome);
                                        setTypeUpdt(TipoProduto.find(type => type.id === selectedProduct.tipo) || "");
                                        setDescriptionUpdt(selectedProduct.descricao);
                                        setPreviewUrl(selectedProduct.fileUrl);
                                    }
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {product.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="nameUpdt">Nome</Label>
                                <Input
                                    id="nameUpdt"
                                    value={nameUpdt}
                                    onChange={(e) => setNameUpdt(e.target.value)}
                                    placeholder="Nome do produto"
                                />
                            </div>

                            <div>
                                <Label htmlFor="typeUpdt">Tipo</Label>
                                <Select value={typeUpdt === "" ? "" : typeUpdt.id.toString()} onValueChange={(value) => setTypeUpdt(value === "" ? "" : TipoProduto.find(tipo => tipo.id === Number(value)) || "")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TipoProduto.map((tipo) => (
                                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <tipo.icon className="h-4 w-4" />
                                                    {tipo.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="descriptionUpdt">Descrição</Label>
                                <Textarea
                                    id="descriptionUpdt"
                                    value={descriptionUpdt}
                                    onChange={(e) => setDescriptionUpdt(e.target.value)}
                                    placeholder="Desrição do produto"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <Label htmlFor="previewUrl">Arquivo</Label>
                                {previewUrl && (
                                    <div className="mb-2">
                                        <a
                                            href={previewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center gap-1">
                                                Visualizar arquivo atual
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                    </div>
                                )}
                                <Input
                                    id="previewUrl"
                                    type="file"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files?.[0];
                                        if (selectedFile) {
                                            setUpdateFile(selectedFile);
                                        }
                                    }}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isUpdating}>
                                {isUpdating ? "Atualizando..." : "Atualizar produto"}
                                <Upload className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Delete Product */}
                             <Card>
                    <CardHeader>
                        <CardTitle>Exclusão de Produtos</CardTitle>
                        <CardDescription>Remova um produto do sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleDlt} className="space-y-4">
                            <div>
                                <Label htmlFor="productsDlt">Selecione o produto para ser removido</Label>
                                <Select value={dltProductId.toString()} onValueChange={(value) => {
                                    const id = value ? Number(value) : "";
                                    setDltProductId(id);
                                    const selectedProductDlt = products.find(product => product.id === id);
                                    if (selectedProductDlt) {
                                        setNameDlt(selectedProductDlt.nome);
                                    }
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {product.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="nameDlt">Nome</Label>
                                <Input
                                    id="nameDlt"
                                    value={nameDlt}
                                    onChange={(e) => setNameDlt(e.target.value)}
                                    placeholder="Nome do produto"
                                    disabled
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                variant="destructive" 
                                className="w-full" 
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Excluindo..." : "Excluir Produto"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

};