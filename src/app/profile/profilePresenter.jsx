"use client";
import { useState, useEffect } from "react";
import ProfileView from "./profileView.jsx";
import { auth, storage } from "@/firebaseModel";
import { getDatabase, ref, get, update, onValue, off } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { observer } from "mobx-react-lite";
import { useModel } from "../model-provider.js";

export default observer(
function Profile() {
  const model = useModel();
  const [pictures, setPictures] = useState([]);
  const [profile, setProfile] = useState({
    username: "Anonymous",
    bio: "",
    avatar: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28",
  });

  useEffect(() => {
    fetchProfileData();
    fetchPictures();

    return () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const db = getDatabase();
        const profileRef = ref(db, `pixeModel/users/${uid}/profile`);
        off(profileRef);
      }
    };
  }, []);

  const saveBioToFirebase = (newBio) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      const db = getDatabase();
      const bioRef = ref(db, `pixeModel/users/${uid}/profile`);
      update(bioRef, { bio: newBio })
        .then(() => {
          setProfile((prevProfile) => ({ ...prevProfile, bio: newBio }));
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
          console.log("Uploaded a blob or file!", snapshot);
          getDownloadURL(path)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);

              // Update the avatar link in Realtime Database
              const db = getDatabase();
              const profileRef = ref(db, `pixeModel/users/${uid}/profile`);
              update(profileRef, { avatar: downloadURL })
                .then(() => {
                  console.log(
                    "Avatar link updated successfully in Realtime Database."
                  );
                })
                .catch((error) => {
                  console.error(
                    "Failed to update avatar link in Realtime Database:",
                    error
                  );
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
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
            username: profileData.username || "Anonymous",
            bio: profileData.bio || "",
            avatar: profileData.avatar !== undefined ? profileData.avatar : "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28",
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
            setPictures(Object.values(snapshot.val()));
          } else {
            console.log("No data available for images.");
            setPictures([]);
          }
        })
        .catch((error) => {
          console.error("Failed to load profile:", error);
        });
    }
  };

  if (!model.userReady || !model.ready) {
    return <div>
             <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading gif"></img>
           </div>
  }
  return (
    <ProfileView
      pictures={pictures}
      profile={profile}
      saveBioToFirebase={saveBioToFirebase}
      saveAvatarToFirebase={saveAvatarToFirebase}
      isOwnProfile={true}
    />
  );
})
