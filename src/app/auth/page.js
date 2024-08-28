"use client";

import useGoogleLogin from "./useGoogleLogin";
import useEmailPasswordLogin from "./useEmailPasswordLogin";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth} from "@/firebaseModel";
import { ref as databaseRef, set, getDatabase, get } from "firebase/database";

export default function LoginPage() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false); // State to toggle form visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const initializeUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user available.");
        return;
    }

    const uid = user.uid;
    console.log("Received UID:", uid);

    const db = getDatabase();

    const path = `pixeModel/users/${uid}`;
    const userRef = databaseRef(db, path);

    console.log("Firebase Database Path: " + path);

    try {
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            console.log(`Initializing data for UID: ${uid}...`);
            await set(userRef, {
                device: 0,
                colorCurrent: "",
                profile: {
                    username: "",
                    bio: "",
                },
            }).then(() => {
                console.log("User data initialized.");
            }).catch((error) => {
                console.error("Error during initialization:", error);
            });
        } else {
            console.log(`Data already exists for path: ${path}`);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

  const handleGoogleLogin = async () => {
    try {
      const user = await useGoogleLogin();
      console.log("Logged in user:", user);
      await initializeUserData();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleEmailPasswordLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await useEmailPasswordLogin(email, password);
      console.log("Logged in user:", user);
      await initializeUserData();
      router.push("/dashboard");
    } catch (error) {
      window.alert("Something went wrong, please try again.");
      console.error("Error logging in:", error);
    }
  };

  const navigateToRegister = () => {
    router.push("/auth/register"); // Navigate to registration page
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password"); // Navigate to forgot password page
  };

  const handleBack = () => {
    setShowLoginForm(false); // Hide the login form to show initial options again
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="p-8 bg-white border border-brown border-4 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Pix-E
        </h1>
        {!showLoginForm && (
          <>
            <button
              onClick={() => setShowLoginForm(true)}
              className="w-full py-2 px-4 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 mb-4"
            >
              Log in with Email and Password
            </button>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2 px-4 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 mb-4"
            >
              Log in with Google
            </button>
            <button
              onClick={navigateToRegister}
              className="w-full py-2 px-4 bg-transparent text-sky-500 text-center text-sm"
            >
              Don't have an account? Register
            </button>
          </>
        )}
        {showLoginForm && (
          <div>
          <form  className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            </form>
            <button
              onClick={handleEmailPasswordLogin}
              type="submit"
              className="w-full py-2 px-4 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
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
            </div>
        )}
      </div>
    </div>
  );
}
