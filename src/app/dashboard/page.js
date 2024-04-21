// app/dashboard/page.js

export default function Dashboard() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Pix-E Dashboard!</h1>
          <p className="text-lg text-gray-600 mb-6">Create and share your pixel art creations.</p>
        </div>
        <footer className="mt-8 text-gray-500">Pix-E</footer>
      </div>
    );
  }
  