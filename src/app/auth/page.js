"use client";

import useGoogleLogin from './useGoogleLogin';
import useEmailPasswordLogin from './useEmailPasswordLogin';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [showLoginForm, setShowLoginForm] = useState(false); // State to toggle form visibility
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = async () => {
        try {
            const user = await useGoogleLogin();
            console.log('Logged in user:', user);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleEmailPasswordLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await useEmailPasswordLogin(email, password);
            console.log('Logged in user:', user);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const navigateToRegister = () => {
        router.push('/auth/register'); // Navigate to registration page
    };

    const handleForgotPassword = () => {
        router.push('/auth/forgot-password'); // Navigate to forgot password page
    };

    const handleBack = () => {
        setShowLoginForm(false); // Hide the login form to show initial options again
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Login to Pix-E</h1>
                {!showLoginForm && (
                    <>
                        <button
                            onClick={() => setShowLoginForm(true)}
                            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mb-4"
                        >
                            Log in with Email and Password
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
                        >
                            Log in with Google
                        </button>
                        <button
                            onClick={navigateToRegister}
                            className="w-full py-2 px-4 bg-transparent text-blue-500 text-center text-sm"
                        >
                            Don't have an account? Register
                        </button>
                    </>
                )}
                {showLoginForm && (
                    <form onSubmit={handleEmailPasswordLogin} className="mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Log in
                        </button>
                        <button
                            onClick={handleBack}
                            className="w-full mt-4 py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleForgotPassword}
                            className="w-full mt-4 py-2 px-4 bg-transparent text-blue-500 text-center text-sm"
                        >
                            Forgot password?
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
