import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseModel";

const useEmailPasswordLogin = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error('Email/Password sign-in error:', error);
        throw error;
    }
};

export default useEmailPasswordLogin;
