import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

const isTokenValid = () => { 
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return isTokenValid() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

