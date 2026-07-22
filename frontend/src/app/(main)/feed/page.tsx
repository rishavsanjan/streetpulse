"use client"

import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const { user, loading } = useAuth();
  console.log(user)
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Feed</h1>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
    </>
  );
}

export default Page