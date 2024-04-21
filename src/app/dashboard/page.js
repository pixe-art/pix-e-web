import Link from 'next/link';

export default function Dashboard() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Pix-E Dashboard!</h1>
          <p className="text-lg text-gray-600 mb-6">Create and share your pixel art creations.</p>

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <Link href="/art-tool">
              <span className="inline-block px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer">Art Tool</span>
            </Link>
            <Link href="/privateGallery">
              <span className="inline-block px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 cursor-pointer">Private Gallery</span>
            </Link>
            <Link href="/publicGallery">
              <span className="inline-block px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer">Public Gallery</span>
            </Link>
          </div>
        </div>
        <footer className="mt-8 text-gray-500">Pix-E</footer>
      </div>
    );
  }
