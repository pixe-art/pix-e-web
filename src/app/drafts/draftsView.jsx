import { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faDownload,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as outlineHeart } from "@fortawesome/free-regular-svg-icons";
import { downloadImage, displayImage } from "../publicGallery/galleryPresenter";
import { observer } from "mobx-react-lite";

function ImageComponent({image, model, addToFavourites, removeFavourite }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [onDisplay, setOnDisplay] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    for (const element of model.users[model.user.uid].favorites) {
      if (image.id === element.id) setIsFavourite(true);
    }
  }, []);

  const toggleFavourite = () => {
    setIsFavourite(!isFavourite);
    if (!isFavourite) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
      addToFavourites(image);
    } else {
      removeFavourite(image.id);
    }
  };

    const toggleOnDisplay = () => {
        setOnDisplay(!onDisplay);
        if (!onDisplay) {
            displayImage(image.id, model.users[model.user.uid].device);
            model.users[model.user.uid].activeImage = image.imageURL;
        }
    }

  return (
    <div className="relative rounded shadow-lg p-4 bg-cream transform transition duration-500 hover:scale-110 hover:z-10">
      <img
        src={image.imageURL}
        alt=""
        className="w-full h-auto object-cover image-pixelated bg-black border-4 border-brown"
      />
      <Dropdown
        className="absolute bottom-0 right-0 mb-2 mr-2"
        onClick={() => /*isMounted &&*/ setDropdownOpen(true)}
      >
        <Dropdown.Toggle variant="none" id="dropdown-basic">
          <BsThreeDots size={24} />
        </Dropdown.Toggle>
        {isDropdownOpen && (
          <Dropdown.Menu
            className="bg-cream text-black rounded-md shadow-lg text-sm flex flex-col p-2 right-0 left-auto"
            onMouseLeave={() => /*isMounted &&*/ setDropdownOpen(false)}
          >
            <Dropdown.Item
              onClick={() => {
                toggleFavourite();
              }}
              className={`hover:bg-gray-400 hover:text-white hover:rounded-md flex items-center p-1 ${
                isFavourite || animate ? "text-red-500" : "text-black"
              }`}
            >
              <FontAwesomeIcon
                icon={isFavourite || animate ? solidHeart : outlineHeart}
                className={`mr-2 ${animate ? "animate-pulse" : ""}`}
              />
              Favourite
            </Dropdown.Item>
            <Dropdown.Item
              className="hover:bg-gray-400 hover:text-white hover:rounded-md flex items-center p-1"
              onClick={() => downloadImage(image.imageURL, image.title)}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download
            </Dropdown.Item>
            <Dropdown.Item
              className="hover:bg-gray-400 hover:text-white hover:rounded-md p-1"
              onClick={() => toggleOnDisplay(image.id)}
              href="#/"
            >
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              Display
            </Dropdown.Item>
          </Dropdown.Menu>
        )}
      </Dropdown>
      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2">{image.title}</div>
        <p className="text-gray-700 text-base">Created by: {image.creator}</p>
      </div>
    </div>
  );
}

export default observer(function DraftsView(props) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-cream transition ease transform duration-300`;

  useEffect(() => {
    setIsMounted(true);
  }, []); //quick solution, may need to revise depending on data scaling

  return (
    <div>
      {" "}
      {isMounted && (
        <div className="min-h-screen bg-cream flex text-black">
          <div
            className={`transition-all duration-300 ${
              isMenuOpen ? "w-64" : "w-16"
            } bg-brown text-white p-4 flex flex-col`}
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
                <div
                  className={`${genericHamburgerLine} ${
                    isMenuOpen
                      ? "opacity-0"
                      : "opacity-50 group-hover:opacity-100"
                  }`}
                />
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
                <Link
                  href="/dashboard"
                  className="text-white no-underline hover:underline"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-white no-underline hover:underline"
                >
                  My Profile
                </Link>
                <Link
                  href="/favourites"
                  className="text-white no-underline hover:underline"
                >
                  Favourites
                </Link>
                <Link
                  href="/publicGallery"
                  className="text-white no-underline hover:underline"
                >
                  Public Gallery
                </Link>
                <Link
                  href="/art-tool"
                  className="text-white no-underline hover:underline"
                >
                  Create a picture
                </Link>
                <Link
                  href="/#"
                  className="text-white no-underline hover:underline"
                >
                  My Drafts
                </Link>
              </>
            )}
          </div>
          <div className="flex-grow p-4">
            <h1 className="text-2xl mb-2">My Drafts</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {props.model.users[props.model.user.uid]?.drafts.length > 0 ? (
                props.model.users[props.model.user.uid].drafts.map((image) => (
                  <ImageComponent
                    key={image.id}
                    model={props.model}
                    image={image}
                    addToFavourites={props.addToFavourites}
                    removeFavourite={props.removeFavourite}
                  />
                ))
              ) : (
                <p>No drafts found!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
