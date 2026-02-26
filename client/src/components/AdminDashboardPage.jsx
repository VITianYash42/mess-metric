// client/src/components/AdminDashboardPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { connectToMealCoin, mintMealCoins } from "../config/web3.js";
import { LiveWasteMonitor } from "./AdminDashboard/LiveWasteMonitor";
import { 
  LayoutDashboard, Utensils, BrainCircuit, LogOut, Users, TrendingUp, AlertTriangle,
  Leaf, ChevronRight, Loader2, Edit, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle,
  Clock, Send, Star, Menu, X, Coins, ScanFace, Download, Calculator
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const MOCK_ATTENDANCE_DATA = [
  { name: 'Mon', breakfast: 850, lunch: 920, dinner: 890 },
  { name: 'Tue', breakfast: 820, lunch: 950, dinner: 880 },
  { name: 'Wed', breakfast: 860, lunch: 910, dinner: 870 },
  { name: 'Thu', breakfast: 840, lunch: 930, dinner: 900 },
  { name: 'Fri', breakfast: 810, lunch: 880, dinner: 850 },
  { name: 'Sat', breakfast: 750, lunch: 820, dinner: 790 },
  { name: 'Sun', breakfast: 780, lunch: 850, dinner: 810 },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminName, setAdminName] = useState("Admin");
  const [messName, setMessName] = useState("Mess");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Replaced Mocks with standard state defaults
  const [menu, setMenu] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Web3 States
  const [adminContract, setAdminContract] = useState(null);
  const [adminWallet, setAdminWallet] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // AI Prediction & Procurement States
  const [isPredicting, setIsPredicting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [predictParams, setPredictParams] = useState({ attendance: 1200, day_of_week: 0, is_weekend: 0, is_special_event: 0 });
  const [isCalculatingProcurement, setIsCalculatingProcurement] = useState(false);
  const [procurementData, setProcurementData] = useState(null);
  const [procurementStudents, setProcurementStudents] = useState(1200);

  const [replyText, setReplyText] = useState({}); 
  const [activeReplyId, setActiveReplyId] = useState(null);

  // Fetch actual data from backend on load
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
      
      if (adminData.name) {
        setAdminName(adminData.name);
        setMessName(adminData.messName);
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Parallel fetching for performance
        const [reviewsRes, mealsRes, menuRes] = await Promise.all([
          axios.get(`${API_URL}/api/reviews`, config).catch(() => ({ data: { data: [] } })),
          axios.get(`${API_URL}/api/meals`, config).catch(() => ({ data: { data: [] } })),
          axios.get(`${API_URL}/api/menu`, config).catch(() => ({ data: { data: [] } }))
        ]);

        // Standardize IDs and map the nested User data correctly
        const formattedFeedbacks = (reviewsRes.data.data || []).map(f => ({
          ...f, 
          id: f._id || f.id,
          // Extract nested populated data properly from MongoDB
          student: f.user?.name || "Anonymous",
          regNo: f.user?.registrationNo || "Unknown",
          // Format the mongoose timestamp into a readable date
          timestamp: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "Recent",
          // Ensure defaults exist so the UI doesn't crash
          status: f.status || 'unread',
          likes: f.likes || 0,
          dislikes: f.dislikes || 0
        }));
        setFeedbacks(formattedFeedbacks);
        
        // Map pending approvals
        const formattedMeals = (mealsRes.data.data || []).map(m => ({...m, id: m._id || m.id}));
        setPendingApprovals(formattedMeals);
        
        // Map menu
        setMenu(menuRes.data.data || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleApproveAndMint = async (request) => {
    let currentContract = adminContract;
    let currentWallet = adminWallet;

    if (!currentContract) {
        const connection = await connectToMealCoin();
        if (connection) {
            setAdminContract(connection.contract);
            setAdminWallet(connection.userAddress);
            currentContract = connection.contract;
        } else return;
    }

    setProcessingId(request.id);
    const success = await mintMealCoins(currentContract, request.walletAddress, "100");

    if (success) {
        try {
          const token = localStorage.getItem('token');
          // Hit backend to mark meal skip as fully approved & rewarded
          await axios.put(`${API_URL}/api/meals/${request.id}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPendingApprovals(prev => prev.map(req => req.id === request.id ? { ...req, status: "approved" } : req));
        } catch (err) {
          console.error("Backend sync failed for approval", err);
        }
    } else {
        alert("Transaction failed or was rejected.");
    }
    setProcessingId(null);
  };

  const handleAiPrediction = async () => {
    setIsPredicting(true);
    setAiPrediction(null);
    try {
      const res = await axios.post(`${API_URL}/api/ai/predict`, predictParams);
      const waste = res.data.predicted_waste_kg || res.data.data?.predicted_waste_kg || 0;
      setAiPrediction({
        predictedWaste: parseFloat(waste).toFixed(2),
        confidence: (90 + Math.random() * 5).toFixed(1), 
        recommendation: waste > 25 ? "High waste expected. Reduce batch sizes by 10%." : "Waste levels look normal. Proceed with standard cooking quantities."
      });
    } catch (error) {
      alert("Failed to connect to AI Engine.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/reports/monthly`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Monthly_Report_${new Date().getMonth() + 1}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Report generation is not available right now.");
    }
  };

  const handleProcurement = async () => {
    setIsCalculatingProcurement(true);
    setProcurementData(null);
    try {
      const res = await axios.post(`${API_URL}/api/ai/procurement`, { students: procurementStudents });
      setProcurementData(res.data.data || res.data.ingredients || []); 
    } catch (error) {
      alert("Failed to calculate procurement.");
    } finally {
      setIsCalculatingProcurement(false);
    }
  };

  const toggleReadStatus = async (id) => {
    const feedback = feedbacks.find(f => f.id === id);
    const newStatus = feedback.status === 'unread' ? 'read' : 'unread';
    
    // Update UI Optimistically
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    
    // Sync to backend
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/reviews/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleReaction = async (id, type) => {
    // 1. Find the current feedback item
    const feedback = feedbacks.find(f => f.id === id);
    if (!feedback) return;

    // Track state locally to prevent infinite clicking
    let newLikes = feedback.likes || 0;
    let newDislikes = feedback.dislikes || 0;
    let newReaction = feedback.userReaction; // 'like' | 'dislike' | null

    // 2. Toggle Logic
    if (type === 'like') {
      if (newReaction === 'like') {
        newLikes -= 1; // Undo like
        newReaction = null;
      } else {
        newLikes += 1; // Add like
        newReaction = 'like';
        if (feedback.userReaction === 'dislike') newDislikes -= 1; // Remove previous dislike
      }
    } else if (type === 'dislike') {
      if (newReaction === 'dislike') {
        newDislikes -= 1; // Undo dislike
        newReaction = null;
      } else {
        newDislikes += 1; // Add dislike
        newReaction = 'dislike';
        if (feedback.userReaction === 'like') newLikes -= 1; // Remove previous like
      }
    }

    // 3. Update UI instantly
    setFeedbacks(prev => prev.map(f => 
      f.id === id ? { ...f, likes: newLikes, dislikes: newDislikes, userReaction: newReaction } : f
    ));

    // 4. Save the new counts to the Backend!
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/reviews/${id}`, { 
        likes: newLikes, 
        dislikes: newDislikes 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to sync reaction with database", err);
    }
  };

  const submitReply = async (id) => {
    const text = replyText[id];
    if (!text) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/reviews/${id}`, { reply: text, status: 'read' }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, reply: text, status: 'read' } : f));
      setActiveReplyId(null);
      setReplyText(prev => ({...prev, [id]: ''}));
    } catch (err) {
      alert("Failed to submit reply. Try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#dbeafe] text-[#1e3a8a]"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="flex min-h-screen bg-[#dbeafe] text-gray-800 font-sans overflow-hidden">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-[#1e3a8a] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-blue-800 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="bg-white/10 p-2 rounded-lg">
                  <Utensils size={20} />
               </div>
               <h1 className="text-xl font-bold tracking-wide">MessMetric</h1>
            </div>
            <p className="text-xs text-blue-300 ml-1">Admin Console • {messName}</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-blue-200 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} />
          <SidebarItem icon={<Coins size={20} />} label="Meal Approvals" active={activeTab === 'approvals'} onClick={() => handleTabChange('approvals')} />
          <SidebarItem icon={<Utensils size={20} />} label="Menu Management" active={activeTab === 'menu'} onClick={() => handleTabChange('menu')} />
          <SidebarItem icon={<BrainCircuit size={20} />} label="AI Insights" active={activeTab === 'ai'} onClick={() => handleTabChange('ai')} />
          <SidebarItem icon={<Users size={20} />} label="Student Feedback" active={activeTab === 'students'} onClick={() => handleTabChange('students')} />
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-200 hover:bg-red-900/30 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        <header className="bg-white/80 backdrop-blur-md shadow-sm px-4 md:px-8 py-5 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-[#1e3a8a] p-1 rounded-md hover:bg-blue-50"><Menu size={24} /></button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e3a8a] truncate max-w-[200px] md:max-w-none">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'approvals' && 'Biometric Approvals'}
                {activeTab === 'menu' && 'Menu Management'}
                {activeTab === 'ai' && 'AI Analytics Engine'}
                {activeTab === 'students' && 'Student Feedback'}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 hidden md:block">Welcome back, {adminName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             {adminWallet && (
               <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 Bank: {adminWallet.substring(0, 6)}...{adminWallet.slice(-4)}
               </div>
             )}
             <div className="bg-blue-50 px-3 py-1 md:px-4 md:py-2 rounded-full text-[#1e3a8a] text-xs md:text-sm font-semibold border border-blue-100 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
             </div>
             <div className="h-8 w-8 md:h-10 md:w-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                {adminName.charAt(0)}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
           <AnimatePresence mode="wait">
             
             {activeTab === 'overview' && (
               <motion.div key="overview" variants={contentVariants} initial="hidden" animate="visible" className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                      <p className="text-sm text-gray-500">Manage your monthly analytics</p>
                    </div>
                    <button onClick={handleDownloadReport} className="flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-md">
                      <Download size={18} />
                      <span className="hidden sm:inline">Download Monthly Report</span>
                    </button>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                   <StatCard title="Total Students" value="1,245" sub="+12 this week" icon={<Users className="text-blue-600" />} color="bg-blue-50" />
                   <StatCard title="Today's Attendance" value="89%" sub="Lunch Service" icon={<TrendingUp className="text-green-600" />} color="bg-green-50" />
                   <StatCard title="Waste Index" value="12kg" sub="-5% from yesterday" icon={<Leaf className="text-emerald-600" />} color="bg-emerald-50" />
                   <StatCard title="Pending Feedback" value={feedbacks.filter(f => f.status === 'unread').length} sub="Needs Attention" icon={<MessageSquare className="text-orange-600" />} color="bg-orange-50" />
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-[350px] md:h-[400px]">
                       <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance Trends</h3>
                       <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={MOCK_ATTENDANCE_DATA}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                             <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                             <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                             <Legend />
                             <Line type="monotone" dataKey="lunch" stroke="#1e3a8a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} name="Lunch" />
                             <Line type="monotone" dataKey="dinner" stroke="#10b77c" strokeWidth={3} dot={{r: 4}} name="Dinner" />
                           </LineChart>
                         </ResponsiveContainer>
                       </div>
                    </div>
                    <div className="flex flex-col h-[350px] md:h-[400px]">
                      <LiveWasteMonitor />
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'approvals' && (
               <motion.div key="approvals" variants={contentVariants} initial="hidden" animate="visible" className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Pending Face ID Scans</h3>
                      <p className="text-sm text-gray-500">Verify student skips and manually release MealCoins.</p>
                    </div>
                 </div>

                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-blue-50/50 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider border-b border-blue-100">
                          <tr>
                            <th className="p-4">Student</th>
                            <th className="p-4">Meal Skipped</th>
                            <th className="p-4">Biometric Status</th>
                            <th className="p-4">Reward Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {pendingApprovals.length === 0 ? (
                            <tr><td colSpan="4" className="p-6 text-center text-gray-500">No pending approvals found.</td></tr>
                          ) : pendingApprovals.map((req) => (
                             <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                               <td className="p-4">
                                 <p className="font-bold text-gray-800">{req.name || req.studentId?.name || "Student"}</p>
                                 <p className="text-xs text-gray-500">{req.regNo || req.studentId?.regNo}</p>
                               </td>
                               <td className="p-4 font-medium text-gray-700">{req.mealSkipped || req.mealType}</td>
                               <td className="p-4">
                                 {req.status === "pending" ? (
                                   <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold w-max border border-amber-200">
                                     <ScanFace size={14} className="animate-pulse" /> Pending Scan
                                   </span>
                                 ) : (
                                   <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold w-max border border-emerald-200">
                                     <CheckCircle size={14} /> Scan Verified
                                   </span>
                                 )}
                               </td>
                               <td className="p-4">
                                 {req.status === "pending" ? (
                                    <button
                                      onClick={() => handleApproveAndMint(req)}
                                      disabled={processingId === req.id}
                                      className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed w-44"
                                    >
                                      {processingId === req.id ? <Loader2 size={16} className="animate-spin" /> : <Coins size={16} />}
                                      {processingId === req.id ? "Minting..." : "Approve & Mint"}
                                    </button>
                                 ) : (
                                    <button disabled className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold w-44 border border-emerald-200">
                                      Reward Sent
                                    </button>
                                 )}
                               </td>
                             </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'menu' && (
               <motion.div key="menu" variants={contentVariants} initial="hidden" animate="visible">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-50/30">
                       <div>
                         <h3 className="text-lg font-bold text-[#1e3a8a]">Weekly Menu Configuration</h3>
                         <p className="text-sm text-gray-500">Managing menu for {messName}</p>
                       </div>
                       <button className="flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20 w-full md:w-auto justify-center">
                         <Edit size={16} />
                         Edit Menu
                       </button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-[#1e3a8a]/5 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Day</th>
                            <th className="p-4">Breakfast</th>
                            <th className="p-4">Lunch</th>
                            <th className="p-4">Snacks</th>
                            <th className="p-4">Dinner</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {menu.length === 0 ? (
                            <tr><td colSpan="6" className="p-6 text-center text-gray-500">No menu data available.</td></tr>
                          ) : menu.map((day, idx) => (
                             <tr key={idx} className="hover:bg-blue-50/40 transition-colors group">
                               <td className="p-4 font-bold text-[#1e3a8a]">{day.day}</td>
                               <td className="p-4 text-sm text-gray-600 group-hover:text-gray-900">{day.breakfast}</td>
                               <td className="p-4 text-sm text-gray-600 group-hover:text-gray-900">{day.lunch}</td>
                               <td className="p-4 text-sm text-gray-600 group-hover:text-gray-900">{day.snacks}</td>
                               <td className="p-4 text-sm text-gray-600 group-hover:text-gray-900">{day.dinner}</td>
                               <td className="p-4">
                                 <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                   Active
                                 </span>
                               </td>
                             </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
               </motion.div>
             )}

             {activeTab === 'ai' && (
                <motion.div key="ai" variants={contentVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-8">
                   <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-blue-50 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-2 flex items-center gap-2">
                            <BrainCircuit /> Waste Forecaster
                          </h2>
                          <p className="text-gray-500 mb-6 text-sm md:text-base">
                            Tweak the parameters below to run our ML model and predict expected food waste.
                          </p>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Expected Attendance</label>
                              <input type="number" value={predictParams.attendance} onChange={(e) => setPredictParams({...predictParams, attendance: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Day of Week (0-6)</label>
                              <select value={predictParams.day_of_week} onChange={(e) => setPredictParams({...predictParams, day_of_week: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="0">Monday</option><option value="1">Tuesday</option><option value="2">Wednesday</option><option value="3">Thursday</option><option value="4">Friday</option><option value="5">Saturday</option><option value="6">Sunday</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <input type="checkbox" id="isWeekend" checked={predictParams.is_weekend === 1} onChange={(e) => setPredictParams({...predictParams, is_weekend: e.target.checked ? 1 : 0})} className="w-4 h-4 text-blue-600 rounded" />
                              <label htmlFor="isWeekend" className="text-sm font-bold text-gray-700">Is Weekend?</label>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <input type="checkbox" id="isSpecial" checked={predictParams.is_special_event === 1} onChange={(e) => setPredictParams({...predictParams, is_special_event: e.target.checked ? 1 : 0})} className="w-4 h-4 text-blue-600 rounded" />
                              <label htmlFor="isSpecial" className="text-sm font-bold text-gray-700">Special Event / Fest?</label>
                            </div>
                          </div>
                          <button onClick={handleAiPrediction} disabled={isPredicting} className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-blue-900 transition-all disabled:opacity-70 w-full md:w-auto">
                            {isPredicting ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
                            {isPredicting ? "Analyzing..." : "Run AI Prediction"}
                          </button>
                        </div>
                        <div className="flex-1 w-full">
                          {aiPrediction ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-50 p-6 rounded-2xl border border-blue-100 h-full flex flex-col justify-center">
                              <p className="text-blue-800 font-bold mb-4 uppercase tracking-wider text-sm">Prediction Results</p>
                              <div className="flex items-end gap-2 mb-4">
                                <span className="text-5xl font-black text-red-500">{aiPrediction.predictedWaste}</span>
                                <span className="text-xl text-gray-500 font-bold mb-1">kg Waste</span>
                              </div>
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">AI Recommendation</p>
                                <p className="text-emerald-700 font-medium text-sm">{aiPrediction.recommendation}</p>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">Waiting for parameters...</div>
                          )}
                        </div>
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Calculator /> Smart Procurement</h2>
                          <p className="text-slate-300 mb-6 text-sm">Input the expected student footfall to instantly generate the raw material requirements for the day.</p>
                          <div className="flex gap-4">
                             <input type="number" value={procurementStudents} onChange={(e) => setProcurementStudents(Number(e.target.value))} className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 w-32 font-bold" />
                             <button onClick={handleProcurement} disabled={isCalculatingProcurement} className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2">
                               {isCalculatingProcurement ? <Loader2 className="animate-spin" size={18} /> : null} Calculate Needs
                             </button>
                          </div>
                        </div>
                        {procurementData && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 w-full bg-slate-800 rounded-xl p-4 border border-slate-700 max-h-60 overflow-y-auto">
                            <table className="w-full text-left text-sm">
                               <thead>
                                 <tr className="text-slate-400 border-b border-slate-700">
                                   <th className="pb-2">Ingredient</th><th className="pb-2 text-right">Qty</th>
                                 </tr>
                               </thead>
                               <tbody>
                                 {procurementData.map((item, idx) => (
                                   <tr key={idx} className="border-b border-slate-700/50">
                                     <td className="py-2 font-medium">{item.name}</td>
                                     <td className="py-2 text-right text-emerald-400 font-bold">{item.qty}</td>
                                   </tr>
                                 ))}
                               </tbody>
                            </table>
                          </motion.div>
                        )}
                      </div>
                   </div>
                </motion.div>
             )}

             {activeTab === 'students' && (
                <motion.div key="students" variants={contentVariants} initial="hidden" animate="visible" className="space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#1e3a8a]">Student Feedback</h3>
                        <p className="text-gray-500">Manage student complaints, reviews, and AI insights.</p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                         <div className="flex-1 md:flex-none bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-600 text-center">
                            Total: <span className="text-[#1e3a8a] font-bold">{feedbacks.length}</span>
                         </div>
                         <div className="flex-1 md:flex-none bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-600 text-center">
                            Unread: <span className="text-red-500 font-bold">{feedbacks.filter(f => f.status === 'unread').length}</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid gap-4">
                      {feedbacks.length === 0 ? (
                        <div className="text-center text-gray-500 p-6 bg-white rounded-xl shadow-sm border border-gray-100">No feedbacks submitted yet.</div>
                      ) : feedbacks.map((feedback) => (
                         <div key={feedback.id} className={`bg-white rounded-2xl p-4 md:p-6 shadow-md border-l-4 transition-all ${feedback.status === 'unread' ? 'border-l-orange-400' : 'border-l-green-400 opacity-90'}`}>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                               <div className="flex gap-3">
                                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[#1e3a8a] font-bold shrink-0">
                                     {(feedback.student || "A").charAt(0)}
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-gray-800">{feedback.student || "Anonymous"}</h4>
                                     <p className="text-xs text-gray-500">{feedback.regNo || "Unknown Reg No"}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                  <Clock size={12} /> {feedback.timestamp || "Recent"}
                               </div>
                            </div>

                            <div className="mb-4">
                               <div className="flex mb-2 items-center gap-3">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={16} className={`${i < (feedback.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                    ))}
                                  </div>
                                  
                                  {/* RENDER AI SENTIMENT IF EXISTS */}
                                  {feedback.aiAnalysis && feedback.aiAnalysis.score !== undefined && (
                                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                       feedback.aiAnalysis.score > 0.1 ? 'bg-green-50 text-green-700 border-green-200' :
                                       feedback.aiAnalysis.score < -0.1 ? 'bg-red-50 text-red-700 border-red-200' :
                                       'bg-gray-50 text-gray-600 border-gray-200'
                                     }`}>
                                       AI Sentiment Score: {feedback.aiAnalysis.score.toFixed(2)}
                                     </span>
                                  )}
                               </div>
                               <p className="text-gray-700 text-sm md:text-base">{feedback.comment}</p>
                            </div>

                            {feedback.reply && (
                               <div className="mb-4 ml-0 md:ml-4 md:pl-4 border-l-0 md:border-l-2 border-gray-200 bg-gray-50 p-3 rounded-lg md:rounded-r-lg md:rounded-l-none">
                                  <p className="text-xs font-bold text-[#1e3a8a] mb-1">Your Reply:</p>
                                  <p className="text-sm text-gray-600">{feedback.reply}</p>
                               </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 mt-2 gap-3">
                               <div className="flex gap-4">
                                  <button 
                                    onClick={() => handleReaction(feedback.id, 'like')} 
                                    className={`flex items-center gap-1 text-sm transition-colors ${
                                      feedback.userReaction === 'like' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'
                                    }`}
                                  >
                                    <ThumbsUp size={16} /> <span>{feedback.likes || 0}</span>
                                  </button>

                                  {/* Dislike Button */}
                                  <button 
                                    onClick={() => handleReaction(feedback.id, 'dislike')} 
                                    className={`flex items-center gap-1 text-sm transition-colors ${
                                      feedback.userReaction === 'dislike' ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'
                                    }`}
                                  >
                                    <ThumbsDown size={16} /> <span>{feedback.dislikes || 0}</span>
                                  </button>
                                  <button onClick={() => setActiveReplyId(activeReplyId === feedback.id ? null : feedback.id)} className={`flex items-center gap-1 text-sm font-medium ${activeReplyId === feedback.id ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>
                                     <MessageSquare size={16} /> <span className="hidden sm:inline">Reply</span>
                                  </button>
                               </div>

                               <button onClick={() => toggleReadStatus(feedback.id)} className={`flex items-center gap-1 text-sm font-medium ${feedback.status === 'read' ? 'text-green-600' : 'text-orange-500 hover:text-orange-600'}`}>
                                  {feedback.status === 'read' ? <><CheckCircle size={16} /> Read</> : <><div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"/> Mark as Read</>}
                               </button>
                            </div>

                            <AnimatePresence>
                               {activeReplyId === feedback.id && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                                     <div className="flex gap-2">
                                        <input type="text" placeholder="Type your reply here..." className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1e3a8a]" value={replyText[feedback.id] || ''} onChange={(e) => setReplyText({...replyText, [feedback.id]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && submitReply(feedback.id)} />
                                        <button onClick={() => submitReply(feedback.id)} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                                           <Send size={16} />
                                        </button>
                                     </div>
                                  </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                      ))}
                   </div>
                </motion.div>
             )}

           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? "bg-white text-[#1e3a8a] shadow-lg font-semibold" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}>
      {icon} <span>{label}</span> {active && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );
}

function StatCard({ title, value, sub, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
      <p className="text-xs text-gray-400 font-medium flex items-center gap-1">{sub}</p>
    </div>
  );
}