import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({children}) => {
    const {user} = useAuth();

    if(!user){
        return <Navigate to="/signin" replace/>
    }

    return children;
}

export default ProtectedRoute;