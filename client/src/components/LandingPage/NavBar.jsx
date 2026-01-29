import { Leaf } from "lucide-react";

export function NavBar() {
  return (
    <>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                  Mess-Metric
                </span>
              </div>
              <nav className="md:flex space-x-6">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-green-600 transition"
                >
                  Features
                </a>
                <a
                  href="/leaderboard"
                  className="text-gray-600 hover:text-green-600 transition"
                >
                  Leaderboard
                </a>
                <a
                  href="/"
                  className="text-gray-600 hover:text-green-600 transition"
                >
                  About
                </a>
              </nav>

              <button className="p-2 rounded-lg text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                Get Started
              </button>
            </div>
          </div>
        </header>
    </>
  );
}
