import { useState } from 'react';
import Link  from 'next/link';

export default function GalleryView() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-cream transition ease transform duration-300`;

    return (
        <div className="min-h-screen bg-cream flex text-black">
            <div 
                className={`transition-all duration-300 ${isMenuOpen ? 'w-64' : 'w-16'} bg-brown text-white p-4 flex flex-col`}
                onMouseLeave={() => setMenuOpen(false)}
            >
                <div className="flex items-center mb-4">
                <button
                    className="flex flex-col h-10 w-12 border-2 border-cream rounded justify-center items-center group"
                    onMouseEnter={() => setMenuOpen(true)}
                    onClick={() => setMenuOpen(!isMenuOpen)} 
                >
                    <div
                        className={`${genericHamburgerLine} ${
                            isMenuOpen
                                ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                                : "opacity-50 group-hover:opacity-100"
                        }`}
                    />
                    <div className={`${genericHamburgerLine} ${isMenuOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"}`} />
                    <div
                        className={`${genericHamburgerLine} ${
                            isMenuOpen
                                ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
                                : "opacity-50 group-hover:opacity-100"
                        }`}
                    />
                </button>
                    {isMenuOpen && <h1 className="text-2xl ml-4">Menu</h1>}
                </div>
                {isMenuOpen && (
                    <>
                        {/* Add menu items here */}
                        <Link href="/privateGallery" className="text-white no-underline hover:underline">My Gallery</Link>
                    </>
                )}
            </div>
            <div className="flex-grow p-4">
                <h1 className="text-2xl mb-2">Gallery</h1>
                <p>Here are some pictures of my favorite things.</p>
            </div>
        </div>
    );
}