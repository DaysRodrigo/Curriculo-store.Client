import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import  Home  from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Crud from "../Pages/Crud/Crud";
import TypeProduct from "../Pages/Product/TypeProduct";
import PrivateRoute from "../Middleware/PrivateRoute";



const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/crud" element={
                     <PrivateRoute> 
                        <Crud />
                     </PrivateRoute>} 
                    />
                <Route path="/product" element={<TypeProduct />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;