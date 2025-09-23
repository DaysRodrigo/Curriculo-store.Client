import { useEffect, useState } from "react";
import { getProducts } from "../../Services/ProductService";
import { TipoProduto } from "@/Enums/TipoProduto";
import { ShoppingCart, User, Code, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeSelector }  from "@/Theme/ThemeSelector";
// import { useTheme } from "next-themes";


interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
    valor: number;
    instituicao: string;
    tecnologias?: string;
    tecnologiasArray?: string[];
    periodo: string;
    
}

export function Home  () {
    const [cart, setCart] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<TipoProduto["id"] | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]); 
    // const { setTheme, resolvedTheme  } = useTheme();


    const addToCart = (item: Product) => {
        setCart([...cart, item]);
    };

    useEffect(() => {
        const getProduct = async () => {
            const data = await getProducts();
            data.forEach((products: Product) => {
                products.tecnologiasArray = products.tecnologias?.split(",")})
            setProducts(data);
        };

        getProduct();
    }, []);
        
    const filteredItems = selectedCategory != null
        ? products.filter(product => product.tipo === selectedCategory)
        : products;
        
    return (
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 bacldro-blur sipports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="h-6 w-6 text-primary" />
                            <h1 className="text-xl font-bold">CV Store</h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                                All Items
                            </Button>
                            {TipoProduto.map(type => (
                                 <Button
                                    key={type.id}
                                    variant="ghost"
                                    onClick={() => setSelectedCategory(type.id)}
                                    className={selectedCategory === type.id ? 'bg-accent' : ''}
                                >
                                    <type.icon className="h-4 w-4 mr-2" />
                                    {type.name}
                                </Button>
                            ))}     
                        </nav>
                        <ThemeSelector />
                        {/* <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
                            >
                            {resolvedTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </Button> */}
                        <Button variant="outline" className="relative">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Cart
                            {cart.length > 0 && (
                                <Badge className="absolute -top-2 -fight-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                    {cart.length}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </header>

                <main className="container py-8">
                    {/* Explain Section */}
                    <section className="text-center py-16 mb-12 rounded-lg bg-gradient-to-r from-primary/5 to-background">
                        <h2 className="text-4xl font-bold mb-4">
                            Welcome to CV Store!
                        </h2>
                        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Explore my CV in a unique way. Each item represents an experience, knowledge, or achievement in my academic and professional career.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="#productsG">
                                <Button size="lg">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Explore Items
                                </Button>
                            </a>
                            <a href="#aboutG">
                                <Button variant="outline" size="lg">
                                    About the Project
                                </Button>    
                            </a>
                        </div>
                    </section>

                    {/* Category Filter */}
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold mb-6">Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {TipoProduto.map(type => (
                                <Card
                                    key={type.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedCategory === type.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                    onClick={() => setSelectedCategory(type.id)}
                                >
                                    <CardContent className="flex flex-col items-center p-6">
                                        <div className={`p-3 rounded-full ${type.color} text-white mb-3`}>
                                            <type.icon className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-semibold text-center">{type.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {products.filter(product => product.tipo == type.id).length} items
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>


                    {/* Product's Grid*/}
                    <section id="productsG">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">
                                {selectedCategory != null
                                    ? TipoProduto.find( type => type.id === selectedCategory)?.name
                                    : 'All Items'
                                }
                            </h3>
                            <p className="text-muted-foreground">
                                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map( product => (
                                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{product.nome}</CardTitle>
                                                <CardDescription className="flex items-center gap-2">
                                                    <span>{product.instituicao}</span>
                                                    <Badge variant="outline">{product.periodo || '-'}</Badge>
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">R${product.valor}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {/* {product.descricao} */}
                                              {product.descricao.split(/(https?:\/\/[^\s]+|www\.[^\s]+)/g).map((part, i) =>
                                                    /(https?:\/\/[^\s]+|www\.[^\s]+)/.test(part) ? (
                                                    <a
                                                        key={i}
                                                        href={part.startsWith('http') ? part : `https://${part}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline"
                                                    >
                                                        {part}
                                                    </a>
                                                    ) : (
                                                    part
                                                    )
                                                )}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {product.tecnologiasArray?.map((skill: string, i: number) => ( 
                                                <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                            ))}

                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => setSelectedProduct(product)}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => addToCart(product)}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* About Project */}
                    <section className="mt-16 py-12 bg-muted/30 rounded-lg" id="aboutG">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold mb-4">About This Project</h3>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                               This is a conceptual project, which transforms a traditional CV into an
                               e-commerce interactive experience, where each 'product' represents an experience,
                               skill, or real achievement of my career.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="text-center">
                                <div className="bg-primary/10 p-4 rounded-full 2-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Star className="h-8 w-8 text-primary" />
                                </div>
                                <h4 className="font-semibold mb-2">Unique Experience</h4>
                                <p className="text-sm text-muted-foreground">
                                    An innovative way of showing achievements and skills
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary/10 p-4 rounded-full 2-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Code className="h-8 w-8 text-primary" />
                                </div>
                                <h4 className="font-semibold mb-2">Technology</h4>
                                <p className="text-sm text-muted-foreground">
                                    Developed with React, TypeScript, .NET, PostgreSQL, and AWS S3.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary/10 p-4 rounded-full 2-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8 text-primary" />
                                </div>
                                <h4 className="font-semibold mb-2">Creativity</h4>
                                <p className="text-sm text-muted-foreground">
                                    Showing skills in a creative way and thinking outside the box
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Modal */}
                <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{selectedProduct?.nome}</DialogTitle>
                            <DialogDescription>
                                {selectedProduct?.instituicao}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-muted-foreground">{selectedProduct?.descricao}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Skills Developed</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProduct?.tecnologiasArray?.map((skill: string, i: number) => ( 
                                        <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <p className="text-2xl font-bold text-primary">R${selectedProduct?.valor}</p>
                                    <p className="text-sm text-muted-foreground">Symbolic Value</p>
                                </div>
                                <Button
                                    onClick={() => {
                                        if (selectedProduct) addToCart(selectedProduct);
                                    }}
                                    disabled={!selectedProduct}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        )
}
