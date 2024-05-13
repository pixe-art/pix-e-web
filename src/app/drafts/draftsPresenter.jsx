'use client'

import { observer } from "mobx-react-lite";
import { useState, useEffect } from 'react';
import { app } from "/src/firebaseModel.js";
import { useModel } from "../model-provider.js";
import DraftsView from "./draftsView.jsx";
import { auth } from "@/firebaseModel";
import { getDatabase, ref, get, update, onValue, off } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

export function downloadImage(url, filename) {
    const storage = getStorage(app);
    const imageRef = storageRef(storage, url);
  
    getDownloadURL(imageRef)
        .then((downloadURL) => {
            console.log('File available at', downloadURL);
            fetch(downloadURL)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(blobUrl); // clean up
                });
        })
        .catch((error) => {
            console.error(error);
        });
  }

export default observer(
    function Drafts() {
    const model = useModel();
    const storage = getStorage(app);
    const [pictures, setPictures] = useState([]);
    const [profile, setProfile] = useState({
      username: 'Anonymous',
      bio: '',
      avatar: 'https://www.computerhope.com/jargon/g/guest-user.png'
    });

    const saveBioToFirebase = (newBio) => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const db = getDatabase();
        const bioRef = ref(db, `pixeModel/users/${uid}/profile`);
        update(bioRef, { bio: newBio }) // Pass an object with the bio field
          .then(() => {
            setProfile(prevProfile => ({ ...prevProfile, bio: newBio }));
          })
          .catch((error) => {
            console.error("Failed to save bio:", error);
          });
      }
    };

    const saveAvatarToFirebase = (avatarFile) => {
      const uid = auth.currentUser?.uid;
      if (uid && avatarFile) {
        const path = storageRef(storage, `avatars/${uid}`);
        
        // Upload the avatar image to Firebase Storage
        uploadBytes(path, avatarFile)
          .then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            getDownloadURL(path)
              .then((downloadURL) => {
                console.log('File available at', downloadURL);
                
                // Update the avatar link in Realtime Database
                const db = getDatabase();
                const profileRef = ref(db, `pixeModel/users/${uid}/profile`);
                update(profileRef, { avatar: downloadURL })
                  .then(() => {
                    console.log('Avatar link updated successfully in Realtime Database.');
                  })
                  .catch((error) => {
                    console.error('Failed to update avatar link in Realtime Database:', error);
                  });
              })
              .catch((error) => {
                console.error('Error getting download URL:', error);
              });
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
          });
      }
    };
    
    // Function to fetch user profile data from Realtime Database
    const fetchProfileData = () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const db = getDatabase();
        const profileRef = ref(db, `pixeModel/users/${uid}/profile`);
        onValue(profileRef, (snapshot) => {
          if (snapshot.exists()) {
            const profileData = snapshot.val() || {};
            setProfile({
              username: profileData.username || 'Anonymous',
              bio: profileData.bio || '',
              avatar: profileData.avatar || 'default-avatar.png'
            });
          } else {
            console.log("No data available for profile.");
          }
        });
      }
    };

    // Function to fetch pictures from Realtime Database
    const fetchPictures = () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const db = getDatabase();
        const imagesRef = ref(db, `pixeModel/users/${uid}/images`);
        get(imagesRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setPictures(snapshot.val() || []);
            } else {
              console.log("No data available for images.");
              setPictures([]);
            }
          })
          .catch((error) => {
            console.error("Failed to load gallery:", error);
          });
      }
    };

    useEffect(() => {
      fetchProfileData(); // Fetch profile data when the component mounts
      fetchPictures(); // Fetch pictures when the component mounts

      // Cleanup function to remove the listener when the component unmounts
      return () => {
        const uid = auth.currentUser?.uid;
        if (uid) {
          const db = getDatabase();
          const profileRef = ref(db, `pixeModel/users/${uid}/profile`);
          off(profileRef); // Remove the profile listener
        }
      };
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    if (!model.userReady || !model.ready) {
      return <div>
               <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading gif"></img>
             </div>
    }

    return (
      <DraftsView
        model={model}
        pictures={pictures}
        profile={profile}
        saveBioToFirebase={saveBioToFirebase}
        saveAvatarToFirebase={saveAvatarToFirebase}
      />
    );
  }
    
);