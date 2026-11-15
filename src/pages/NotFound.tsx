import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
    <h1 className="text-6xl font-bold text-teal-400">404</h1>
    <p className="max-w-md text-sm text-gray-400">The page you are looking for could not be found.</p>
    <Link className="rounded-md border border-teal-400 px-5 py-2 text-sm font-semibold text-teal-300 transition hover:bg-teal-400 hover:text-black" to="/">Back to Home</Link>
  </main>;
}
