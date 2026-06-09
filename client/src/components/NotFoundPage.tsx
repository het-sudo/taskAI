import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f8] px-6 text-center">
      <h1 className="text-8xl font-bold text-red-400">404</h1>

      <h2 className="mt-4 text-3xl font-semibold text-gray-900">
        Page Not Found
      </h2>

      <p className="mt-3 max-w-md text-gray-500">
        The page you are looking for does not exist or may have been moved.
      </p>

      <Link
        to={"/"}
        className="
          mt-8 rounded-xl bg-red-400 px-6 py-3
          font-medium text-white transition-all
          duration-200 hover:scale-[1.01]
          hover:bg-red-500
        "
      >
        Back to Home
      </Link>
    </div>
  )
}
