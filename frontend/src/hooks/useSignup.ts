import api from '../api.js'
import { useAuth } from '@/context/AuthContext.jsx';

export const useSignup = () => {
    const {setUser} = useAuth();
    const signup = async ({ fullName, email, phone, password, confirmPassword }) => {
        const success = handleInputErrors({ fullName, email, phone, password, confirmPassword });
        if (!success) return;

        try {
            const res = await api.post('/api/auth/signup', {
                fullName,
                email,
                phone,
                password,
                confirmPassword
            })
            const data = await res.data
            if(data.error){
                throw new Error(data.error)
            } 
            // localstorage
            localStorage.setItem('chatuser', JSON.stringify(data));

            // context to set user
            setUser(data);
        } catch (err) {
            console.error(err)
        }
    }

    return { signup }
}

const handleInputErrors = ({ fullName, email, phone, password, confirmPassword }) => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        throw new Error("All fields are required!")
    }
    if (password != confirmPassword) {
        throw new Error("Passowrds do not match!")
    }
    return true;
}
