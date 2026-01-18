const { useAuth } = require("@/context/AuthContext");
const { Navigate } = require("react-router-dom");

const ProtectedRoute = ({children}) => {
    const {user} = useAuth();

    if(!user){
        return <Navigate to="/signin" replace/>
    }

    return children;
}

export default ProtectedRoute;