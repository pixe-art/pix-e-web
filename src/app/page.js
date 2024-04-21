// app/page.js
import Head from 'next/head';

export default function Home() {
  function logACB() {
    console.log("Clicked!");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Pix-E | Pixel Art Display</title>
        <meta name="description" content="Display and create beautiful pixel art with Pix-E." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-md w-full p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Pix-E!</h1>
        <p className="text-lg text-gray-600 mb-6">Create and share your pixel art creations.</p>
        <div>
          <a href="/auth" className="text-blue-500 hover:text-blue-700">
            <h2 className="text-lg font-semibold">Login &rarr;</h2>
          </a>
        </div>
      </main>

      <footer className="mt-8 text-gray-500">Pix-E</footer>
    </div>
  );
}
