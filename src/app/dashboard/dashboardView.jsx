import Link from "next/link";
import { useEffect, useState } from 'react';
import { auth, signOut } from '@/firebaseModel';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { ref as databaseRef, getDatabase, get } from "firebase/database";

export default function Dashboard(props) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch username from Firebase
        const userRef = databaseRef(getDatabase(), `pixeModel/users/${currentUser.uid}/profile`);
        const snapshot = await get(userRef);
        if (snapshot.exists() && snapshot.val().username) {
          setUsername(snapshot.val().username);
        } else {
          // Redirect to username setting page if username is not set
          router.push('/auth/set-username');
        }
      } else {
        // User is signed out
        setUser(null);
        router.push('/auth'); // Redirect to login page if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  function setPicturesACB() {
    props.model.images = [...props.model.images, 
      {
        id: '9',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F9.png?alt=media&token=e6a19dff-146a-4210-a9db-75b04f4ebc3a",
        title: "Wide Putin",
        creator: "Some memester",
        storage: "gs://pix-e-b9fab.appspot.com/images/9.png",
        lastEdited: "3",
    }];
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
      >
        Logout
      </button>
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg text-center border-8 border-black rounded-xl">
        {user && (
          <p className="text-sm text-gray-600 mb-4">Logged in as: {username || user.uid}</p>

        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Pix-E Dashboard!
        </h1>
        <button className="text-3xl font-bold text-gray-800 mb-4" onClick={setPicturesACB}>Click to update data in firebase!</button>
        <p className="text-lg text-gray-600 mb-6">
          Create and share your pixel art creations.
        </p>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Currently on your Pix-E:</h2>

        <div className="mb-6 bg-black w-320 h-640 border-4 border-black rounded-xl">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/art1.png?alt=media&token=afd1e2a8-0da2-4524-a0b4-7f813fffd7d1"
            alt="Pixel Art"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Link href="/art-tool">
            <span className="inline-block px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer">
              Art Tool
            </span>
          </Link>
          <Link href="/favourites">
            <span className="inline-block px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 cursor-pointer">
              Favourites
            </span>
          </Link>
          <Link href="/publicGallery">
            <span className="inline-block px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer">
              Public Gallery
            </span>
          </Link>
        </div>
      </div>
      <footer className="mt-8 text-gray-500">Pix-E</footer>
    </div>
  );
}
