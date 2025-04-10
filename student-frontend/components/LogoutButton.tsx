'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login'); // or router.refresh() if you just want a hard refresh
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:underline ml-4"
    >
      Logout
    </button>
  );
}
