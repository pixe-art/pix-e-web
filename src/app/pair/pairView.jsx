import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faDownload, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faHeart as outlineHeart } from '@fortawesome/free-regular-svg-icons';
// import { set, goOffline, getDatabase, update } from 'firebase/database';
import { addToFavourites, downloadImage, displayImage } from './pairPresenter';
import { connectToFirebase } from '../../firebaseModel';
import { useModel } from "/src/app/model-provider.js";
import { app } from "/src/firebaseModel.js";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { auth } from '@/firebaseModel';


function handlePair(props, code) {
    const model = props.model;
    console.log(props.model);
    console.log(code)
    if (String(code).length == 4) {
        const currentUser = model.user.uid;
        const db = getDatabase(app);
        const PATH = "pixeModel";
        const rf = ref(db, PATH);
        console.log(code);
        console.log(model)
        get(child(rf, `pairingCodes/${code}`)).then((snapshot) => {
            if (snapshot.exists()) {
                let deviceID = snapshot.val();
                console.log("deviceID:")
                console.log(deviceID);
                console.log("####")
                let obj = {
                    screens: {
                        [deviceID]: {
                            owner: "0"
                        }
                    },
                    users: {
                        [currentUser]: {
                            device: "0"
                        }
                    }
                };
                console.log(obj)
                obj.screens[deviceID].owner = currentUser;
                obj.users[currentUser].device = deviceID;
                console.log("obj:")
                console.log(obj);
                // update(rf, obj);
                model.users[currentUser].device = deviceID;
                model.screens[deviceID].owner = currentUser;
                // update(rf,)
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}


function PairForm(model) {
    return (
        <form onSubmit={handlePair} className="space-y-6">
            form text
            <input
                type="number"
                placeholder="0000"
                onChange={(e) => handlePair(model, e.target.value)}
                // onChange={(e) => console.log(e)}
                max={9999}
                min={1}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* <button
                type='button'
                // onClick={(e) => handlePair(model, e.target.value)}
                onClick={(e) => console.log(e)}
                
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Pair
            </button> */}
        </form>
    )
}

export default function PairView(props) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-cream transition ease transform duration-300`;


    useEffect(() => {
        setIsMounted(true);
    }, []);


    return (
        <div> {isMounted &&
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
                                className={`${genericHamburgerLine} ${isMenuOpen
                                    ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                                    : "opacity-50 group-hover:opacity-100"
                                    }`}
                            />
                            <div className={`${genericHamburgerLine} ${isMenuOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"}`} />
                            <div
                                className={`${genericHamburgerLine} ${isMenuOpen
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
                            <Link href="/dashboard" className="text-white no-underline hover:underline">Dashboard</Link>
                            <Link href="/profile" className="text-white no-underline hover:underline">My Profile</Link>
                            <Link href="/favourites" className="text-white no-underline hover:underline">Favourites</Link>
                            <Link href="#" className="text-white no-underline hover:underline">Public Gallery</Link>
                            <Link href="/art-tool" className="text-white no-underline hover:underline">Create a picture</Link>
                            <Link href="/pair" className="text-white no-underline hover:underline">Pair Pix-E</Link>
                        </>
                    )}
                </div>

                <PairForm model={props.model}></PairForm>

            </div>
        }</div>
    );
}