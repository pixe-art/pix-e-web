"use client";

import { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseModel";
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Check your email for the reset link'); // Inform the user to check their email
            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('Password reset error:', error);
            setMessage(''); // Clear any previous messages
            setError(error.message); // Display error message to the user
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h1>
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Send Reset Email
                    </button>
                    {message && (
                        <p className="text-green-500">{message}</p>
                    )}
                    {error && (
                        <p className="text-red-500">{error}</p>
                    )}
                </form>
            </div>
        </div>
    );
}
