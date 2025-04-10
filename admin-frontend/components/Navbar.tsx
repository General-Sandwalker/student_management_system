'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div  className="text-lg font-bold">
        <Link href="/dashboard" className="hover:underline" onClick={() => router.push("/dashboard")}>
          Admin Panel
        </Link>
      </div>
      <div className="space-x-4">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/students" className="hover:underline">Students</Link>
        <Link href="/departments" className="hover:underline">Departments</Link>
        <Link href="/formations" className="hover:underline">Formations</Link>
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Login
          </button>
        </Link>
        <button onClick={handleLogout} className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
}
