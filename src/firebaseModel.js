import app from './firebaseInit';
import { getAuth } from 'firebase/auth';

export const auth = getAuth(app);
