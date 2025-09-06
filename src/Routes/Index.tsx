import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "@/Pages/Home/Home";
import { Login } from "@/Pages/Login/Login";
import { Crud } from "@/Pages/Crud/Crud";
import PrivateRoute from "@/Middleware/PrivateRoute";
import { CustomThemeProvider } from "@/contexts/ThemeContext";
import { ThemeProvider } from "next-themes";




const AppRoutes = () => {

    return (
        <Router>
            <ThemeProvider>
            <CustomThemeProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/crud" element={
                        <PrivateRoute> 
                            <Crud />
                        </PrivateRoute>} 
                        />
                </Routes>
            </CustomThemeProvider>
            </ThemeProvider>
        </Router>
    );
};

export default AppRoutes;