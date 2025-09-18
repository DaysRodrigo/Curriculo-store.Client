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
import { ExternalLink, Upload } from "lucide-react";

interface Product {
    id?: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl?: string;
    instituicao: string;
    valor: number;
    tecnologias: string;
    tecnologiasArray?: string[];
    periodo?: string;
}

interface ProductUpdt {
    id?: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl?: string;
    instituicao: string;
    valor: number;
    tecnologias: string[];
    periodo?: string;
}

export function Crud () {
    //Create
    const [name, setName] = React.useState("");
    const [type, setType] = useState<TipoProduto | null>(null);
    const [description, setDescription] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);
    const [instituition, setInstituition] = React.useState("");
    const [techs, setTechs] = React.useState<string[]>([]);
    const [techInput, setTechInput] = React.useState<string>('');
    const [period, setPeriod] = React.useState("");
    const [value, setValue] = React.useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    //Update
    const [nameUpdt, setNameUpdt] = React.useState("");
    const [typeUpdt, setTypeUpdt] = useState<TipoProduto | null>(null);
    const [descriptionUpdt, setDescriptionUpdt] = React.useState("");
    const [updateFile, setUpdateFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [instituitionUpdt, setInstituitionUpdt] = React.useState("");
    const [techsUpdt, setTechsUpdt] = React.useState<string[]>([]);
    const [techInputUpdt, setTechInputUpdt] = React.useState<string>('');
    const [periodUpdt, setPeriodUpdt] = React.useState("");
    const [valueUpdt, setValueUpdt] = React.useState<number | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    //Delete
    const [nameDlt, setNameDlt] = React.useState("");
    const [dltProductId, setDltProductId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    //General
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();

    const handleIdChange = async (selectedProduct: Product) => {
        localStorage.setItem("selectedId", String(selectedProduct.id));
    }
    
    useEffect(() => {
        const getProduct = async () => {
            try {
                setIsLoading(true);
                const data: Array<Product> = await getProducts();
                data.forEach((products: Product) => {
                    products.tecnologiasArray  = products.tecnologias.split(",");
                });
                setProducts(data);
            } catch (error: unknown) {
                if( error instanceof Error ) {
                    toast({
                        variant: "destructive",
                        title: "Erro",
                        description: "Erro ao carregar produtos. " + error.message
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getProduct();
    }, [toast]);


    const addTech = () => {
        if (techInput.trim() !== '') {
            setTechs([...techs, techInput.trim()]);
            setTechInput('');
        }
    };

    const removeTech = (index: number) => {
        setTechs(techs.filter((_, i) => i !== index));
    };

    const addTechUpdt = () => {
        if (techInputUpdt.trim() !== '') {
            setTechsUpdt([...techsUpdt, techInputUpdt.trim()]);
            setTechInputUpdt('');
        }
    };

    const removeTechUpdt = (index: number) => {
        setTechsUpdt(techsUpdt.filter((_, i) => i !== index));
    };
        
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || description.trim() === "" || type === null || value === null) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha todos os campos obrigatórios"
            });
            return;
        }

        if ((type.id === 0 || type.id === 2) && !file) {
            toast({
                variant: "destructive",
                title: "Arquivo necessário",
                description: "Para este tipo, é necessário fornecer um arquivo"
            });
            return;
        }

        if ( !techs ) {
            toast({
                variant: "destructive",
                title: "Tecnologia necessária",
                description: "É necessário selecionar as tecnologias"
            });
            return;
        }

        try {
            setIsCreating(true);
            const data: ProductUpdt = {
                nome: name,
                tipo: type.id,
                descricao: description,
                instituicao: instituition,
                valor: value,
                periodo: period,
                tecnologias: techs
            };

            if ( file ) {
                const publicUrl = await uploadFile(file);
                data.fileUrl = publicUrl;
            }
            const response = await createProduct(data);
            if (response &&  response.status === 200) {
                toast({
                    title: "Sucesso",
                    description: "Produto criado com sucesso."
                });

                //Reset Form
                setName("");
                setType(null);
                setDescription("");
                setValue(null);
                setPeriod("");
                setInstituition("");
                setTechs([]);
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
        } catch (error: unknown) {
            if( error instanceof Error ) {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Erro ao criar produto: " + error.message
                });
            }
        } finally {
            setIsCreating(false);
        }
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!nameUpdt || typeUpdt === null || !descriptionUpdt || (typeUpdt.id === 2 && !updateFile )) {
            console.log('Chegou no erro');
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha todos os campos"
            });
            return;
        }
        try {
            setIsUpdating(true);
            let fileUrl = previewUrl;
            
            if (updateFile) {
                const publicUrl = await uploadFile(updateFile);
                fileUrl = publicUrl;
                setPreviewUrl(publicUrl);
            }
            const id = Number(localStorage.getItem('selectedId'));
            const data: ProductUpdt = {
                nome: nameUpdt,
                tipo: typeUpdt ? typeUpdt.id : 0,
                fileUrl: fileUrl || '',
                descricao: descriptionUpdt,
                tecnologias: techsUpdt,
                valor: valueUpdt ? valueUpdt : 0,
                periodo: periodUpdt,
                instituicao: instituitionUpdt
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
        } catch (error: unknown) {
                if( error instanceof Error ) {
                    toast({
                        variant: "destructive",
                        title: "Erro",
                        description: "Erro ao atualizar o produto: " + error.message
                    });
                }
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
                setDltProductId(null);
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
        } catch (error: unknown) {
            if( error instanceof Error ) {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Erro ao excluir produto: " + error.message
                });
            }
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
                                <Select value={ type?.id.toString() || "" }
                                    onValueChange={(value) =>
                                        setType(value ? TipoProduto.find(tipo => tipo.id === Number(value)) || null : null )}>
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
                                <Label htmlFor="instituition">Instituição</Label>
                                <Input
                                    id="instituition"
                                    value={instituition}
                                    onChange={(e) => setInstituition(e.target.value)}
                                    placeholder="Instituição do produto"
                                    type="text"
                                />
                            </div>

                            <div>
                                <Label htmlFor="period">Período</Label>
                                <Input
                                    id="period"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    placeholder="Período do produto"
                                    type="text"
                                />
                            </div>

                            <div>
                                <Label htmlFor="value">Valor</Label>
                                <Input 
                                    id="value"
                                    value={value ?? ""}
                                    onChange={(e) => setValue(e.target.value === "" ? null : Number(e.target.value))}
                                    placeholder="Valor do produto"
                                    type="number"
                                />
                            </div>

                            <div>
                                <Label htmlFor="techs">Tecnologias</Label>
                                
                                <div>
                                    <Input 
                                        id="techs"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        placeholder="Digite uma tecnologia e pressione Enter"
                                        type="text"
                                        onKeyUp={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTech();
                                            }
                                        }}
                                    />
                                    <Button onClick={addTech}>
                                        Adicionar
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {techs.map((tech, index) => (
                                        <div key={index}>
                                            {tech}
                                            <Button 
                                                onClick={() => removeTech(index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
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
                                <Select value={ selectedProductId?.toString() || "" } onValueChange={(value) => {
                                    const id = value ? Number(value) : null;
                                    setSelectedProductId(id);
                                    const selectedProduct = products.find(product => product.id === id);
                                    if (selectedProduct) {
                                        handleIdChange(selectedProduct);
                                        setNameUpdt(selectedProduct.nome);
                                        setTypeUpdt(TipoProduto.find(type => type.id === selectedProduct.tipo) || null);
                                        setDescriptionUpdt(selectedProduct.descricao);
                                        setPreviewUrl(selectedProduct.fileUrl || null);
                                        setInstituitionUpdt(selectedProduct.instituicao);
                                        setPeriodUpdt(selectedProduct.periodo || "");
                                        setValueUpdt(selectedProduct.valor);
                                        setTechsUpdt(selectedProduct.tecnologiasArray!);
                                    }
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products
                                            .filter((product) => product.id !== undefined)
                                            .map((product) => (
                                            <SelectItem key={product.id} value={product.id!.toString()}>
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
                                <Select value={typeUpdt?.id.toString() || "" } onValueChange={(value) =>
                                        setTypeUpdt(value ? TipoProduto.find(tipo => tipo.id === Number(value)) || null : null)}>
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
                                <Label htmlFor="instituitionUpdt">Instituição</Label>
                                <Input
                                    id="instituitionUpdt"
                                    value={instituitionUpdt}
                                    onChange={(e) => setInstituitionUpdt(e.target.value)}
                                    placeholder="Instituição do produto"
                                    type="text"
                                />
                            </div>

                            <div>
                                <Label htmlFor="periodUpdt">Período</Label>
                                <Input
                                    id="periodUpdt"
                                    value={periodUpdt}
                                    onChange={(e) => setPeriodUpdt(e.target.value)}
                                    placeholder="Período do produto"
                                    type="text"
                                />
                            </div>

                            <div>
                                <Label htmlFor="valueUpdt">Valor</Label>
                                <Input 
                                    id="valueUpdt"
                                    value={valueUpdt ?? ""}
                                    onChange={(e) => setValueUpdt(e.target.value === "" ? null : Number(e.target.value))}
                                    placeholder="Valor do produto"
                                    type="number"
                                />
                            </div>

                            <div>
                                <Label htmlFor="techsUpdt">Tecnologias</Label>
                                
                                <div>
                                    <Input 
                                        id="techsUpdt"
                                        value={techInputUpdt}
                                        onChange={(e) => setTechInputUpdt(e.target.value)}
                                        placeholder="Digite uma tecnologia e pressione Enter"
                                        type="text"
                                        onKeyUp={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTechUpdt();
                                            }
                                        }}
                                    />
                                    <Button onClick={addTechUpdt}>
                                        Adicionar
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {techsUpdt.map((tech, index) => (
                                        <div key={index}>
                                            {tech}
                                            <Button
                                                onClick={() => removeTechUpdt(index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
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
                                <Select value={dltProductId?.toString() || ""} onValueChange={(value) => {
                                    const id = value ? Number(value) : null;
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
                                        {products
                                            .filter((product) => product.id !== undefined)
                                            .map((product) => (
                                            <SelectItem key={product.id} value={product.id!.toString()}>
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