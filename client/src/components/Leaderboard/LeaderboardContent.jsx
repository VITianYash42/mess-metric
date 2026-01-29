import { motion } from "motion/react";
import { Badge } from "lucide-react";
import { useState } from "react";

export function LeaderboardContent(){
  const [ currentPage, setCurrentPage ] = useState(1);

  const leaderboardData = [
    { rank: 1, name: 'Priya Sharma', rollNo: 'CS2024089', mealsSkipped: 156, co2Saved: 43.2, coins: 1560, badges: 12, hostel: 'North A' },
    { rank: 2, name: 'Rahul Verma', rollNo: 'ME2024045', mealsSkipped: 148, co2Saved: 41.0, coins: 1480, badges: 11, hostel: 'South B' },
    { rank: 3, name: 'Sneha Patel', rollNo: 'EE2024023', mealsSkipped: 142, co2Saved: 39.3, coins: 1420, badges: 10, hostel: 'East' },
    { rank: 4, name: 'Arjun Reddy', rollNo: 'CS2024102', mealsSkipped: 138, co2Saved: 38.2, coins: 1380, badges: 10, hostel: 'West' },
    { rank: 5, name: 'Meera Iyer', rollNo: 'BT2024034', mealsSkipped: 135, co2Saved: 37.4, coins: 1350, badges: 9, hostel: 'North B' },
    ...Array.from({ length: 45 }, (_, i) => ({
      rank: i + 6,
      name: `Student ${i + 6}`,
      rollNo: `XX2024${String(i + 100).padStart(3, '0')}`,
      mealsSkipped: 130 - i * 2,
      co2Saved: 36 - i * 0.5,
      coins: 1300 - i * 20,
      hostel: ['North A', 'North B', 'South A', 'South B', 'East', 'West'][i % 6],
    })),
  ];

  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleClick = (number) => {
    setCurrentPage(number);
  };



  return(
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              Green Champion Leaderboard
            </span>
          </h1>
          <p className="text-xl text-gray-600">Celebrating our sustainability heroes</p>
        </motion.div>

        {/* Rankings */}
        <div className="bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <div className="space-y-2">
              {currentItems.map((student, index) => {
                const rankColors = {
                  1: "bg-amber-500", 
                  2: "bg-gray-400",  
                  3: "bg-orange-400" 
                };

                const bgColor = rankColors[student.rank] || "bg-gray-100 text-gray-700";

                return (
                  <motion.div
                    key={student.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColor} font-bold text-gray-700`}>
                        {student.rank}
                      </div>
                      <div className="w-12 h-12">
                        <div className="bg-green-100 text-green-700 flex items-center justify-center w-12 h-12 rounded-full">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.rollNo} • {student.hostel}</div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-20 text-sm">
                      <div className="text-center">
                        <div className="font-bold">{student.mealsSkipped}</div>
                        <div className="text-xs text-gray-600">Meals</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{student.co2Saved} kg</div>
                        <div className="text-xs text-gray-600">CO₂</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-amber-600">{student.coins}</div>
                        <div className="text-xs text-gray-600">Coins</div>
                      </div>
                    </div>
                  </motion.div>
              )})}
            </div>
            
          </div>
        </div>
          
        <div className="flex justify-center"> 
          <div className="flex justify-center gap-10 mt-5 border-orange-500 border-2 p-3 rounded-2xl text-base font-semibold w-fit">
            {/* Previous Button (Optional) */}
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-yellow-600 cursor-pointer"
            >
              Previous
            </button>

            {/* Number Loop */}
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handleClick(number)}
                className={currentPage === number ? 'text-orange-600' : 'text-yellow-500'}
              >
                {number}
              </button>
            ))}

            {/* Next Button */}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-yellow-600 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  ) 
}