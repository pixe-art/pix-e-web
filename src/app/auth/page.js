// pages/auth/page.js

"use client";

import useGoogleLogin from './useGoogleLogin';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const handleGoogleLogin = async () => {
        try {
            const user = await useGoogleLogin(); // Correct usage of the imported function
            console.log('Logged in user:', user);
            // Redirect or manage state as needed, such as redirecting to the dashboard or home page
            router.push('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <h1>Login to Pix-E</h1>
            <button onClick={handleGoogleLogin}>Log in with Google</button>
        </div>
    );
}
