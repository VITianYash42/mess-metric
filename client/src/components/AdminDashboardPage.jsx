import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Utensils, 
  BrainCircuit, 
  LogOut, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Leaf,
  ChevronRight,
  Loader2,
  Edit,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Clock,
  Send,
  Star
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const MOCK_ATTENDANCE_DATA = [
  { name: 'Mon', breakfast: 850, lunch: 920, dinner: 890 },
  { name: 'Tue', breakfast: 820, lunch: 950, dinner: 880 },
  { name: 'Wed', breakfast: 860, lunch: 910, dinner: 870 },
  { name: 'Thu', breakfast: 840, lunch: 930, dinner: 900 },
  { name: 'Fri', breakfast: 810, lunch: 880, dinner: 850 },
  { name: 'Sat', breakfast: 750, lunch: 820, dinner: 790 },
  { name: 'Sun', breakfast: 780, lunch: 850, dinner: 810 },
];

const MOCK_MENU_DATA = [
  { 
    day: "Monday", 
    breakfast: "Idli, Sambar, Chutney, Coffee", 
    lunch: "Rice, Dal Fry, Aloo Gobi, Roti, Curd", 
    snacks: "Samosa, Tea", 
    dinner: "Veg Biryani, Raita, Salad" 
  },
  { 
    day: "Tuesday", 
    breakfast: "Aloo Paratha, Curd, Pickle", 
    lunch: "Jeera Rice, Rajma Masala, Mix Veg, Chapati", 
    snacks: "Biscuits, Coffee", 
    dinner: "Egg Curry / Paneer Butter Masala, Paratha" 
  },
  { 
    day: "Wednesday", 
    breakfast: "Poha, Jalebi, Milk", 
    lunch: "Lemon Rice, Sambar, Poriyal, Papad", 
    snacks: "Kachori, Tea", 
    dinner: "Fried Rice, Manchurian, Soup" 
  },
  { 
    day: "Thursday", 
    breakfast: "Puri Bhaji, Halwa", 
    lunch: "Rice, Kadi Pakoda, Bhindi Fry, Roti", 
    snacks: "Sandwich, Juice", 
    dinner: "Chole Bhature, Onion Salad, Gulab Jamun" 
  },
  { 
    day: "Friday", 
    breakfast: "Uttapam, Coconut Chutney", 
    lunch: "Rice, Dal Makhani, Dum Aloo, Naan", 
    snacks: "Cake, Coffee", 
    dinner: "Veg Pulao, Dal Tadka, Papad" 
  },
  { 
    day: "Saturday", 
    breakfast: "Bread Omelette / Bread Jam, Milk", 
    lunch: "Khichdi, Begun Bhaja, Chutney, Papad", 
    snacks: "Maggie / Pasta", 
    dinner: "Chapati, Chicken Curry / Malai Kofta" 
  },
  { 
    day: "Sunday", 
    breakfast: "Masala Dosa, Sambar, Chutney", 
    lunch: "Veg Feast: Pulao, Poori, Paneer, Sweet", 
    snacks: "Corn, Tea", 
    dinner: "Light Dinner: Dal, Rice, Subji" 
  }
];

const MOCK_FEEDBACKS = [
  { 
    id: 1, 
    student: "Rahul Sharma", 
    regNo: "21BCE1023",
    rating: 2, 
    comment: "The rice in lunch today was heavily undercooked. Please check.", 
    timestamp: "2 hours ago", 
    status: "unread", 
    likes: 5, 
    dislikes: 0,
    reply: null 
  },
  { 
    id: 2, 
    student: "Ananya Gupta", 
    regNo: "21BCS2045",
    rating: 5, 
    comment: "Loved the Paneer Butter Masala yesterday! Best dinner this month.", 
    timestamp: "5 hours ago", 
    status: "read", 
    likes: 24, 
    dislikes: 1,
    reply: "Glad you liked it Ananya! We will try to bring it back soon."
  },
  { 
    id: 3, 
    student: "Vikram Singh", 
    regNo: "21BCE1101",
    rating: 1, 
    comment: "Hygiene issue: Found a small stone in the Dal. This is unacceptable.", 
    timestamp: "1 day ago", 
    status: "unread", 
    likes: 12, 
    dislikes: 0,
    reply: null
  },
  { 
    id: 4, 
    student: "Sneha Reddy", 
    regNo: "21BCI3302",
    rating: 4, 
    comment: "Breakfast service was a bit slow today, but food was tasty.", 
    timestamp: "1 day ago", 
    status: "read", 
    likes: 3, 
    dislikes: 0,
    reply: null
  }
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminName, setAdminName] = useState("Admin");
  const [messName, setMessName] = useState("Mess");
  const [loading, setLoading] = useState(true);

  const [menu, setMenu] = useState([]);
  const [feedbacks, setFeedbacks] = useState(MOCK_FEEDBACKS);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const [replyText, setReplyText] = useState({}); 
  const [activeReplyId, setActiveReplyId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    
    if (!token || !adminData.name) {
      navigate('/admin/login');
      return;
    }

    setAdminName(adminData.name);
    setMessName(adminData.messName);
    
    setMenu(MOCK_MENU_DATA); 
    setLoading(false);
  }, []);

  const toggleReadStatus = (id) => {
    setFeedbacks(prev => prev.map(f => 
      f.id === id ? { ...f, status: f.status === 'unread' ? 'read' : 'unread' } : f
    ));
  };

  const handleReaction = (id, type) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id !== id) return f;
      if (type === 'like') return { ...f, likes: f.likes + 1 };
      if (type === 'dislike') return { ...f, dislikes: f.dislikes + 1 };
      return f;
    }));
  };

  const submitReply = (id) => {
    const text = replyText[id];
    if (!text) return;

    setFeedbacks(prev => prev.map(f => 
      f.id === id ? { ...f, reply: text, status: 'read' } : f
    ));
    setActiveReplyId(null);
    setReplyText(prev => ({...prev, [id]: ''}));
  };

  const handleAiPrediction = async () => {
    setIsPredicting(true);
    setAiPrediction(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAiPrediction({
        predictedWaste: 18.5,
        confidence: 94,
        recommendation: "High waste expected for Rice. Reduce production by 8%."
      });
    } catch (error) {
      console.error("Prediction Error");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const sidebarVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#dbeafe] text-[#1e3a8a]"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="flex min-h-screen bg-[#dbeafe] text-gray-800 font-sans overflow-hidden">
      
      <motion.div 
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="w-64 bg-[#1e3a8a] text-white flex flex-col shadow-2xl z-20"
      >
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-2 mb-1">
             <div className="bg-white/10 p-2 rounded-lg">
                <Utensils size={20} />
             </div>
             <h1 className="text-xl font-bold tracking-wide">MessMetric</h1>
          </div>
          <p className="text-xs text-blue-300 ml-1">Admin Console • {messName}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Utensils size={20} />} label="Menu Management" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
          <SidebarItem icon={<BrainCircuit size={20} />} label="AI Insights" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <SidebarItem icon={<Users size={20} />} label="Student Feedback" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-200 hover:bg-red-900/30 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-5 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a8a]">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'menu' && 'Menu Management'}
              {activeTab === 'ai' && 'AI Analytics Engine'}
              {activeTab === 'students' && 'Student Feedback Hub'}
            </h2>
            <p className="text-sm text-gray-500">Welcome back, {adminName}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-blue-50 px-4 py-2 rounded-full text-[#1e3a8a] text-sm font-semibold border border-blue-100">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
             </div>
             <div className="h-10 w-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold">
                {adminName.charAt(0)}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           <AnimatePresence mode="wait">
             
             {activeTab === 'overview' && (
               <motion.div 
                 key="overview"
                 variants={contentVariants}
                 initial="hidden"
                 animate="visible"
                 className="space-y-6"
               >
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <StatCard title="Total Students" value="1,245" sub="+12 this week" icon={<Users className="text-blue-600" />} color="bg-blue-50" />
                   <StatCard title="Today's Attendance" value="89%" sub="Lunch Service" icon={<TrendingUp className="text-green-600" />} color="bg-green-50" />
                   <StatCard title="Waste Index" value="12kg" sub="-5% from yesterday" icon={<Leaf className="text-emerald-600" />} color="bg-emerald-50" />
                   <StatCard title="Pending Feedback" value={feedbacks.filter(f => f.status === 'unread').length} sub="Needs Attention" icon={<MessageSquare className="text-orange-600" />} color="bg-orange-50" />
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
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

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
                       <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Waste Breakdown</h3>
                       <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: 'Rice', waste: 40 },
                              { name: 'Curry', waste: 25 },
                              { name: 'Veg', waste: 15 },
                              { name: 'Bread', waste: 10 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" tick={{fontSize: 12}} />
                              <Tooltip cursor={{fill: '#f3f4f6'}} />
                              <Bar dataKey="waste" fill="#f87171" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'menu' && (
               <motion.div key="menu" variants={contentVariants} initial="hidden" animate="visible">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/30">
                       <div>
                         <h3 className="text-lg font-bold text-[#1e3a8a]">Weekly Menu Configuration</h3>
                         <p className="text-sm text-gray-500">Managing menu for {messName}</p>
                       </div>
                       <button className="flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20">
                         <Edit size={16} />
                         Edit Menu
                       </button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
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
                          {menu.map((day, idx) => (
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
                <motion.div key="ai" variants={contentVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
                   <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <BrainCircuit size={150} />
                      </div>
                      
                      <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">AI Prediction Engine</h2>
                        <p className="text-blue-200 mb-8 max-w-lg">
                          Utilize our advanced machine learning model to forecast food waste and optimize production quantity.
                        </p>
                        <button 
                          onClick={handleAiPrediction}
                          disabled={isPredicting}
                          className="flex items-center gap-2 bg-white text-[#1e3a8a] px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isPredicting ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
                          {isPredicting ? "Running Analysis..." : "Run Waste Prediction"}
                        </button>
                      </div>
                   </div>

                   <AnimatePresence>
                     {aiPrediction && (
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
                       >
                         <div className="bg-green-50 p-4 border-b border-green-100 flex items-center gap-2 text-green-800">
                            <Leaf size={20} />
                            <span className="font-bold">Prediction Results Generated Successfully</span>
                         </div>
                         <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                               <p className="text-gray-500 text-sm font-medium uppercase mb-1">Predicted Waste</p>
                               <p className="text-4xl font-bold text-red-500">{aiPrediction.predictedWaste} <span className="text-lg text-gray-400">kg</span></p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                               <p className="text-gray-500 text-sm font-medium uppercase mb-1">Model Confidence</p>
                               <p className="text-4xl font-bold text-[#1e3a8a]">{aiPrediction.confidence}<span className="text-lg text-gray-400">%</span></p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                               <p className="text-gray-500 text-sm font-medium uppercase mb-1">Recommendation</p>
                               <p className="text-lg font-bold text-emerald-600 mt-2">{aiPrediction.recommendation}</p>
                            </div>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </motion.div>
             )}

             {activeTab === 'students' && (
                <motion.div key="students" variants={contentVariants} initial="hidden" animate="visible" className="space-y-6">
                   
                   <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-2xl font-bold text-[#1e3a8a]">Student Feedback</h3>
                        <p className="text-gray-500">Manage student complaints, reviews, and suggestions.</p>
                      </div>
                      <div className="flex gap-2">
                         <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
                            Total: <span className="text-[#1e3a8a] font-bold">{feedbacks.length}</span>
                         </div>
                         <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
                            Unread: <span className="text-red-500 font-bold">{feedbacks.filter(f => f.status === 'unread').length}</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid gap-4">
                      {feedbacks.map((feedback) => (
                         <div 
                           key={feedback.id} 
                           className={`bg-white rounded-2xl p-6 shadow-md border-l-4 transition-all ${
                             feedback.status === 'unread' ? 'border-l-orange-400' : 'border-l-green-400 opacity-90'
                           }`}
                         >
                            <div className="flex justify-between items-start mb-3">
                               <div className="flex gap-3">
                                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[#1e3a8a] font-bold">
                                     {feedback.student.charAt(0)}
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-gray-800">{feedback.student}</h4>
                                     <p className="text-xs text-gray-500">{feedback.regNo}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                  <Clock size={12} />
                                  {feedback.timestamp}
                               </div>
                            </div>

                            <div className="mb-4">
                               <div className="flex mb-2">
                                  {[...Array(5)].map((_, i) => (
                                     <Star key={i} size={16} className={`${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                  ))}
                               </div>
                               <p className="text-gray-700">{feedback.comment}</p>
                            </div>

                            {feedback.reply && (
                               <div className="mb-4 ml-4 pl-4 border-l-2 border-gray-200 bg-gray-50 p-3 rounded-r-lg">
                                  <p className="text-xs font-bold text-[#1e3a8a] mb-1">Your Reply:</p>
                                  <p className="text-sm text-gray-600">{feedback.reply}</p>
                               </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 mt-2">
                               <div className="flex gap-4">
                                  <button 
                                    onClick={() => handleReaction(feedback.id, 'like')}
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                  >
                                    <ThumbsUp size={16} /> <span>{feedback.likes}</span>
                                  </button>
                                  <button 
                                    onClick={() => handleReaction(feedback.id, 'dislike')}
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                                  >
                                    <ThumbsDown size={16} /> <span>{feedback.dislikes}</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => setActiveReplyId(activeReplyId === feedback.id ? null : feedback.id)}
                                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${activeReplyId === feedback.id ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}
                                  >
                                     <MessageSquare size={16} /> Reply
                                  </button>
                               </div>

                               <button 
                                 onClick={() => toggleReadStatus(feedback.id)}
                                 className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                                    feedback.status === 'read' ? 'text-green-600' : 'text-orange-500 hover:text-orange-600'
                                 }`}
                               >
                                  {feedback.status === 'read' ? (
                                     <><CheckCircle size={16} /> Read</>
                                  ) : (
                                     <><div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"/> Mark as Read</>
                                  )}
                               </button>
                            </div>

                            <AnimatePresence>
                               {activeReplyId === feedback.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4"
                                  >
                                     <div className="flex gap-2">
                                        <input 
                                          type="text" 
                                          placeholder="Type your reply here..."
                                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1e3a8a]"
                                          value={replyText[feedback.id] || ''}
                                          onChange={(e) => setReplyText({...replyText, [feedback.id]: e.target.value})}
                                          onKeyDown={(e) => e.key === 'Enter' && submitReply(feedback.id)}
                                        />
                                        <button 
                                          onClick={() => submitReply(feedback.id)}
                                          className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                                        >
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
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? "bg-white text-[#1e3a8a] shadow-lg font-semibold" 
          : "text-blue-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <ChevronRight size={16} className="ml-auto" />}
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
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
        {sub}
      </p>
    </div>
  );
}