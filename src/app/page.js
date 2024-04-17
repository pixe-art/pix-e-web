//app/page.js
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pix-E | Pixel Art Display</title>
        <meta name="description" content="Display and create beautiful pixel art with Pix-E." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to Pix-E!
        </h1>
        <p>
          Create and share your pixel art creations.
        </p>

        <div>
          <a href="/auth">
            <h2>Login &rarr;</h2>
          </a>
        </div>
      </main>

      <footer>
        <p>Pix-E</p>
      </footer>
    </div>
  );
}
