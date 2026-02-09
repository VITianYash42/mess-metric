import { useState, useRef, useEffect } from "react";
import { Leaf, Coins, Bell, User, LogOut, Settings, ChevronDown, Mail, Hash, Building2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function StudentDashboardNavBar({user}) {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  
  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Close the profile dropdown
    setIsProfileOpen(false);
    // Navigate to login page
    navigate('/login');
  };

  const handleProfile = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Close the profile dropdown
    setIsProfileOpen(false);
    // Navigate to profile page
    navigate('/student/profile');
  };
  
  const useOutsideClick = (callback) => {
    const ref = useRef();
    useEffect(() => {
      const handleClick = (event) => {
        // Don't close if clicking on a button inside the dropdown
        const clickedButton = event.target.closest('button');
        if (clickedButton && ref.current && ref.current.contains(clickedButton)) {
          return; // Don't close dropdown if clicking a button inside it
        }
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };
      // Use a small delay to ensure button clicks process first
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClick);
      }, 10);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClick);
      };
    }, [callback]);
    return ref;
  };
  
  const notifRef = useOutsideClick(() => setIsNotifOpen(false));
  const profileRef = useOutsideClick(() => setIsProfileOpen(false));
  const profileModalRef = useRef();
  
  useEffect(() => {
    const handleClick = (event) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target)) {
        setIsProfileModalOpen(false);
      }
    };
    if (isProfileModalOpen) {
      document.addEventListener('mousedown', handleClick);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.body.style.overflow = 'unset';
    };
  }, [isProfileModalOpen]);
  
  if (!user) {
    return <div className="p-4 text-gray-500">Loading tracker...</div>;
  }
  const studentData = {
    name: user.name,
    rollNumber: user.registrationNo || '0',
    mealCoins: user.mealCoins,
    email: user.email || 'Not provided',
    messName: user.messName || 'Not provided',
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl transition-transform group-hover:scale-110">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            {/* 👇 Hide text on very small screens to save space */}
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent hidden xs:block">
              Mess-Metric
            </span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-6">
            
            <div className="flex items-center space-x-1 md:space-x-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
              <Coins className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
              <span className="font-bold text-amber-700 text-xs md:text-sm">{studentData.mealCoins}</span>
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
                // 👇 FIXED: Changed w-80 to w-[85vw] max-w-xs so it fits mobile screens
                <div className="absolute right-0 mt-3 w-[85vw] max-w-xs bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in duration-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700 text-sm md:text-base">Notifications</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                      >
                        Mark all read
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
                          <p className="text-xs md:text-sm text-slate-600">
                            {notif.text.replace(notif.highlight, '')}
                            <span className="font-semibold text-slate-800">{notif.highlight}</span>
                          </p>
                          <span className="text-[10px] md:text-xs text-slate-400 mt-1 block">{notif.time}</span>
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
                className="flex items-center space-x-1 md:space-x-2 p-1 pr-2 md:pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="bg-gradient-to-tr from-emerald-100 to-green-200 text-emerald-700 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full font-bold border border-emerald-200 shadow-sm text-xs md:text-sm">
                  {studentData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in duration-150 z-50"
                >
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-800 truncate">{studentData.name}</p>
                    <p className="text-xs text-slate-500 truncate">{studentData.rollNumber}</p>
                  </div>
                  <div className="p-1">
                    <Link 
                      to="/student/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" /> <span>Profile</span>
                    </Link>
                    <button 
                      type="button"
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" /> <span>Settings</span>
                    </button>
                    <hr className="my-1 border-slate-50" />
                    <button 
                      onClick={handleLogout}
                      type="button"
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div 
            ref={profileModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Profile Details</h2>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {studentData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{studentData.name}</p>
                  <p className="text-emerald-50 text-sm">{studentData.rollNumber}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-lg bg-white shadow-sm text-emerald-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Email</p>
                  <p className="text-base font-semibold text-slate-800 break-words">{studentData.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-lg bg-white shadow-sm text-purple-600">
                  <Hash className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Registration Number</p>
                  <p className="text-base font-semibold text-slate-800 break-words">{studentData.rollNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 rounded-lg bg-white shadow-sm text-orange-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Mess Name</p>
                  <p className="text-base font-semibold text-slate-800 break-words">{studentData.messName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="p-2 rounded-lg bg-white shadow-sm text-amber-600">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-600 uppercase tracking-wide font-medium mb-1">Meal Coins</p>
                  <p className="text-lg font-bold text-amber-700">{studentData.mealCoins}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}