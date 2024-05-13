"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseModel";
export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registered user:', userCredential.user);
            router.push('/dashboard'); // Redirect to dashboard after registration
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message); // Display error message to the user
        }
    };

    const handleBackToLogin = () => {
        router.push('/auth'); // Navigate back to the login page
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream">
            <div className="p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Register for Pix-E</h1>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && (
                        <div className="text-red-500 text-sm mb-2">{error}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                    >
                        Register
                    </button>
                </form>
                <button
                    onClick={handleBackToLogin}
                    className="mt-4 w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
