import { useState } from 'react';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faDownload, faQuestion, faPen, faCamera } from '@fortawesome/free-solid-svg-icons';
import { faHeart as outlineHeart } from '@fortawesome/free-regular-svg-icons';
import { saveToFirebase } from '@/firebaseModel';

export default function MyGalleryView({
  pictures,
  profile,
  saveBioToFirebase,
  saveAvatarToFirebase,
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(profile.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-cream transition ease transform duration-300`;

  // Ensure pictures is always treated as an array
  const validPictures = Array.isArray(pictures)
    ? pictures.filter((picture) => typeof picture.testPicture === 'string')
    : [];

  const toggleEditingBio = () => {
    setEditingBio(!isEditingBio);
    setNewBio(profile.bio); // Reset the editing bio to the initial value
  };

  const handleSaveChanges = () => {
    saveBioToFirebase(newBio);
    setEditingBio(false);
  };

  const handleAvatarChange = (e) => {
    console.log("Handling avatar change");
    const file = e.target.files[0];
    setSelectedAvatar(file);
    saveAvatarToFirebase(file);
  };

  const handleUploadAvatar = () => {
    if (selectedAvatar) {
      saveAvatarToFirebase(selectedAvatar);
    }
  };

  const ImageComponent = ({ picture, index }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isFavourite, setFavourite] = useState(false);

    const toggleFavourite = () => {
      setFavourite(!isFavourite);
    };

    return (
      <div className="relative rounded shadow-lg p-4 bg-cream transform transition duration-500 hover:scale-110 hover:z-10">
        <img
          src={picture.testPicture}
          alt={`Gallery Picture ${index + 1}`}
          className="w-full h-auto object-cover"
        />
        <Dropdown
          show={isDropdownOpen}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          onMouseLeave={() => setDropdownOpen(false)}
          className="absolute bottom-2 right-2"
        >
          <Dropdown.Toggle
            variant="none"
            className="p-0 border-0 bg-transparent"
          >
            <BsThreeDots />
          </Dropdown.Toggle>
          <Dropdown.Menu className="bg-cream text-black rounded-md shadow-lg text-sm flex flex-col p-2">
            <Dropdown.Item
              className={`hover:bg-gray-400 hover:text-white hover:rounded-md flex items-center p-1 ${
                isFavourite ? 'text-red-500' : ''
              }`}
              onClick={toggleFavourite}
            >
              <FontAwesomeIcon
                icon={isFavourite ? solidHeart : outlineHeart}
                className="mr-2"
              />
              {isFavourite ? 'Unfavorite' : 'Favorite'}
            </Dropdown.Item>
            <Dropdown.Item className="hover:bg-gray-400 hover:text-white hover:rounded-md flex items-center p-1">
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download
            </Dropdown.Item>
            <Dropdown.Item
              className="hover:bg-gray-400 hover:text-white hover:rounded-md p-1"
              href="#/"
            >
              <FontAwesomeIcon icon={faQuestion} className="mr-2" />
              Something
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="px-6 py-4">
          <h3 className="font-bold text-lg mb-2">{picture.title || `Picture ${index + 1}`}</h3>
          <p className="text-gray-700 text-base">Created by: {picture.creator || 'Unknown'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream text-black flex">
      <div
        className={`transition-all duration-300 ${
          isMenuOpen ? 'w-64' : 'w-16'
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
                  ? 'rotate-45 translate-y-3 opacity-50 group-hover:opacity-100'
                  : 'opacity-50 group-hover:opacity-100'
              }`}
            />
            <div
              className={`${genericHamburgerLine} ${
                isMenuOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
              }`}
            />
            <div
              className={`${genericHamburgerLine} ${
                isMenuOpen
                  ? '-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100'
                  : 'opacity-50 group-hover:opacity-100'
              }`}
            />
          </button>
          {isMenuOpen && <h1 className="text-2xl ml-4">Menu</h1>}
        </div>
        {isMenuOpen && (
          <>
            <Link
              href='/dashboard'
              className='text-white no-underline hover:underline'
            >
              Dashboard
            </Link>
            <Link href='#' className='text-white no-underline hover:underline'>
              My Gallery
            </Link>
            <Link
              href='/publicGallery'
              className='text-white no-underline hover:underline'
            >
              Public Gallery
            </Link>
            <Link
              href='/art-tool'
              className='text-white no-underline hover:underline'
            >
              Create a Picture
            </Link>
          </>
        )}
      </div>

      <div className='flex-grow p-4 flex flex-col items-center'>
        <div className='flex flex-col items-center mb-8'>
          <div className="relative">
            <img
              src={profile.avatar}
              alt='User Avatar'
              className='w-24 h-24 rounded-full border-4 border-black mb-4'
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full cursor-pointer flex items-center justify-center w-8 h-8"
              title="Upload Avatar"
            >
              <FontAwesomeIcon icon={faCamera} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className='text-center max-w-sm'>
            <h2 className='text-3xl font-semibold mb-1'>{profile.username}</h2>
            {!isEditingBio ? (
              <>
                <p className='text-sm text-gray-700 break-words'>{profile.bio}</p>
                <FontAwesomeIcon
                  icon={faPen}
                  className='cursor-pointer ml-2 text-gray-600 hover:text-black'
                  onClick={toggleEditingBio}
                />
              </>
            ) : (
              <div className='flex flex-col mt-2' style={{ width: '400px' }}>
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows={4}
                  placeholder="Edit your bio..."
                  className='border border-gray-300 rounded p-2 text-black w-full'
                  style={{ resize: 'none' }}
                />
                <div className='flex justify-end mt-2'>
                  <button
                    className='mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded'
                    onClick={toggleEditingBio}
                  >
                    Discard
                  </button>
                  <button
                    className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded'
                    onClick={handleSaveChanges}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {validPictures.length ? (
          <div className='grid grid-cols-3 gap-4 w-full'>
            {validPictures.map((picture, index) => (
              <ImageComponent key={index} picture={picture} index={index} />
            ))}
          </div>
        ) : (
          <p>No pictures available.</p>
        )}
      </div>
    </div>
  );
}
