import { Trophy, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export function LeaderboardHeader(){
  return(
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-yellow-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <button className="flex items-center text-lg group">
                <ArrowLeft className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
                Back
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-xl">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Green Champions
              </span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>
    </>
  )
}