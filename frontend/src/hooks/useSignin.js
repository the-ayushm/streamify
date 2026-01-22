import { useAuth } from '@/context/AuthContext.jsx';
import api from '../api.js'

export const useSignin = () => {
    const {setUser} = useAuth();
    const signin = async ({email, password}) => {
        const success = handleInputError({email, password});
        if(!success) return;

        try{
            // send post request to backend
            const res = await api.post("/api/auth/signin", {
                email, password
            })
            const data = await res.data;
            if(data.error){
                throw new Error(data.error);
            }

            // save to localStorage
            localStorage.setItem("chatuser", JSON.stringify(data));
            
            // set context to remember user
            setUser(data.user);

        }catch(err){
            console.error(err);
        }
    }
    return  {signin};
}

const handleInputError = ({email, password}) => {
    if(!email || !password){
        alert("All fields are required!");
        return false;
    }
    return true;
}