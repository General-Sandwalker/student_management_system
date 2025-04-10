export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">🎓 Student Management System</h1>
      <p className="text-lg text-gray-600 mb-8">
        Welcome! Use the navigation to register, view your profile, or explore available formations.
      </p>

      <div className="space-x-4">
        <a
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Register
        </a>
        <a
          href="/formations"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          View Formations
        </a>
        <a
          href="/profile"
          className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Profile
        </a>
      </div>
    </main>
  );
}
