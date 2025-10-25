import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center flex gap-4">
        <div className="size-36">
          <img src="/illustration.png" className="w-full" />
          <div>
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <p className="text-white/80 mt-2 text-lg">Page Not Found......</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
