import axios from 'axios'

export const useSignup = () => {

    const signup = async ({ fullName, email, phone, password, confirmPassword }) => {
        const success = handleInputErrors({ fullName, email, phone, password, confirmPassword })
        if (!success) return

        try {
            const res = await axios.post('/api/auth/signup', {
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
            localStorage.saveItem('chatuser', data);

            // context to set user
        } catch (err) {
            console.log(err)
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
}
