"use client";
import SetUsernamePresenter from './setUsernamePresenter';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/firebaseModel';

const SetUsernamePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!auth.currentUser) {
      router.push('/auth');
    }
  }, [router]);

  return <SetUsernamePresenter />;
};

export default SetUsernamePage;
