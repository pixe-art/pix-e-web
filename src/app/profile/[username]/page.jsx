'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { auth } from '@/firebaseModel';
import { getDatabase, ref, onValue, off } from "firebase/database";
import ProfileView from '../profileView.jsx'; 

export default function UserProfilePage() {
    const pathname = usePathname();
    const [profile, setProfile] = useState(null);
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        const segments = pathname.split('/');
        const username = segments.length > 2 ? segments[2] : null;

        if (!username) {
            console.log('Username parameter is missing or empty.');
            setLoading(false);
            return;
        }

        const db = getDatabase();
        const usernameNoSpaces = username.replace(/%20/g, ' '); //Convert space in url (%20) to ' ' to fetch from Firebase
        const usernameRef = ref(db, `pixeModel/usernames/${usernameNoSpaces}`);

        onValue(usernameRef, (snapshot) => {
            if (snapshot.exists()) {
                const uid = snapshot.val().uid;
                console.log('Retrieved UID for username:', username, uid);

                setIsOwnProfile(auth.currentUser && auth.currentUser.uid === uid);

                const profileRef = ref(db, `pixeModel/users/${uid}/profile`);
                const imagesRef = ref(db, `pixeModel/users/${uid}/images`);

                onValue(profileRef, (profileSnapshot) => {
                    if (profileSnapshot.exists()) {
                        console.log('Profile data loaded for UID:', uid);
                        const profileData = profileSnapshot.val();
                        const avatar = profileData.avatar && profileData.avatar.trim() !== '' ? profileData.avatar 
                            : "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28";
                
                        setProfile({
                            username: profileData.username || 'Anonymous',
                            bio: profileData.bio || '',
                            avatar: avatar
                        });
                    }else {
                        console.log('No profile data found for UID:', uid);
                        setProfile({
                            username: 'Not found',
                            bio: 'We could not find this user, please try again',
                            avatar: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28"
                        });
                    }
                    setLoading(false);
                });

                onValue(imagesRef, (imagesSnapshot) => {
                    if (imagesSnapshot.exists()) {
                        console.log('Image data loaded for UID:', uid);
                        setPictures(Object.values(imagesSnapshot.val()));
                    } else {
                        console.log('No image data found for UID:', uid);
                        setPictures([]);
                    }
                });

            } else {
                console.log('No UID found for username:', username);
                setLoading(false);
            }
        });

        return () => {
            off(usernameRef);
        };
    }, [pathname]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!profile) {
        setProfile({
            username: 'Not found',
            bio: 'We could not find this user, please try again',
            avatar: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28"
        });
        return <ProfileView profile={profile}/>;
    }

    return <ProfileView profile={profile} pictures={pictures} isOwnProfile={isOwnProfile} />;
}