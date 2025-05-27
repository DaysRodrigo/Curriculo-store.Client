import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import  Home  from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Crud from "../Pages/Crud/Crud";
import TypeProduct from "../Pages/Product/TypeProduct";
import PrivateRoute from "../Middleware/PrivateRoute";
import Header from "../Pages/Header/Header";

interface Product {
    id: number;
    nome: string;
    descricao: string;
    tipo: number;
    fileUrl: string;
}

const AppRoutes = () => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <Router>
            <Header 
                toggleCart={toggleCart}
                cartItems={cartItems}
                isCartOpen={isCartOpen}
                setCartItems={setCartItems} />
            <Routes>
                <Route path="/" element={<Home 
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        toggleCart={toggleCart}
                        isCartOpen={isCartOpen} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/crud" element={
                     <PrivateRoute> 
                        <Crud />
                     </PrivateRoute>} 
                    />
                <Route path="/product/:tipo" element={<TypeProduct 
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        toggleCart={toggleCart}
                        isCartOpen={isCartOpen}/>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;