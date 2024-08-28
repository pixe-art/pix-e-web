import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth} from '@/firebaseModel';
import { ref, get, getDatabase, update} from 'firebase/database';
import SetUsernameView from './setUsernameView';
import { useModel } from '@/app/model-provider';

const SetUsernamePresenter = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const dbRef = getDatabase();
    const model = useModel();
  
    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };
  
    const checkUsernameUnique = async (username) => {
      const usernameRef = ref(dbRef, `pixeModel/usernames/${username}`);
      const snapshot = await get(usernameRef);
      return !snapshot.exists();
    };
  
    const handleSaveUsername = async () => {
      setLoading(true);
      setError('');
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setError('Username is already taken, please choose another one.');
        setLoading(false);
        return;
      }
  
      // Only update the username field, preserving other fields like bio
      model.users[model.user.uid].profile.username = username;
      const uid = auth.currentUser.uid;
      const userProfileRef = ref(dbRef, `pixeModel/users/${uid}/profile`);
  
      try {
        // Map username to UID for uniqueness
        const usernameRef = ref(dbRef, `pixeModel/usernames/${username}`);
        await update(usernameRef, { uid });
        
        router.push('/dashboard'); // Redirect to the dashboard
      } catch (error) {
        setError('Failed to set username. Please try again.');
        console.error("Error setting username:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return <SetUsernameView
              username={username}
              onChangeUsername={handleUsernameChange}
              onSaveUsername={handleSaveUsername}
              loading={loading}
              error={error}
            />;
  };
  
  export default SetUsernamePresenter;