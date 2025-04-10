import './globals.css';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export const metadata = {
  title: 'Student Management System',
  description: 'Manage student registration and formation enrollment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">
        <header className="bg-gray-800 shadow-md">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/">
              <h1 className="text-xl font-bold text-blue-400 hover:underline">Student Portal</h1>
            </Link>
            <ul className="flex space-x-6 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-blue-400">Home</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600">Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400">Register</Link>
              </li>
              <li>
                <Link href="/formations" className="hover:text-blue-400">Formations</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-blue-400">Profile</Link>
              </li>
              <li>
                <LogoutButton></LogoutButton>
              </li>
            </ul>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto py-10 px-4">{children}</main>
      </body>
    </html>
  );
}

