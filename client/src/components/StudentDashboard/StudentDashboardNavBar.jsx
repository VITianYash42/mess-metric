import { useState, useRef, useEffect } from "react";
import { Leaf, Coins, Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export function StudentDashboardNavBar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      text: "Your meal rebate for Monday Lunch has been approved.", 
      time: "2 hours ago",
      highlight: "Monday Lunch"
    },
    { 
      id: 2, 
      text: "New menu added for next week.", 
      time: "5 hours ago",
      highlight: "next week"
    }
  ]);

  const studentData = {
    name: 'Alex Kumar',
    rollNumber: 'CS2024001',
    mealCoins: 245,
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  const useOutsideClick = (callback) => {
    const ref = useRef();
    useEffect(() => {
      const handleClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) callback();
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [callback]);
    return ref;
  };

  const notifRef = useOutsideClick(() => setIsNotifOpen(false));
  const profileRef = useOutsideClick(() => setIsProfileOpen(false));

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl transition-transform group-hover:scale-110">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
              Mess-Metric
            </span>
          </Link>

          <div className="flex items-center space-x-3 md:space-x-6">
            
            <div className="flex items-center space-x-2 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-sm">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-amber-700 text-sm">{studentData.mealCoins}</span>
            </div>

            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in duration-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Notifications</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-400">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                          <p className="text-sm text-slate-600">
                            {notif.text.replace(notif.highlight, '')}
                            <span className="font-semibold text-slate-800">{notif.highlight}</span>
                          </p>
                          <span className="text-xs text-slate-400 mt-1 block">{notif.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="bg-gradient-to-tr from-emerald-100 to-green-200 text-emerald-700 flex items-center justify-center w-9 h-9 rounded-full font-bold border border-emerald-200 shadow-sm">
                  {studentData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in duration-150 z-50">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-800 truncate">{studentData.name}</p>
                    <p className="text-xs text-slate-500 truncate">{studentData.rollNumber}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">
                      <User className="w-4 h-4" /> <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" /> <span>Settings</span>
                    </button>
                    <hr className="my-1 border-slate-50" />
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" /> <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}