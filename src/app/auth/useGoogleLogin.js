// auth/useGoogleLogin.js
import { auth, GoogleAuthProvider, signInWithPopup } from '../../firebaseConfig';

const useGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
    }
};

export default useGoogleLogin;
