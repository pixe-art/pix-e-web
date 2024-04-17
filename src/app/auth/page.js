// pages/auth/page.js

"use client";

import useGoogleLogin from './useGoogleLogin';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const handleGoogleLogin = async () => {
        try {
            const user = await useGoogleLogin();
            console.log('Logged in user:', user);
            router.push('/dashboard'); // Navigate to dashboard after login
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Login to Pix-E</h1>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Log in with Google
                </button>
            </div>
        </div>
    );
}
