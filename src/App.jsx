import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import React, { useState, useMemo, useEffect } from 'react';
// Chú ý: Đã tạm ẩn import supabase-js để tránh lỗi biên dịch trong môi trường xem trước. 
// Khi chạy thực tế trên máy tính, bạn có thể bỏ comment dòng bên dưới:
// import { createClient } from '@supabase/supabase-js';

import { 
  LayoutDashboard, Droplets, Sprout, CircleDollarSign, BookOpen, Calendar,
  Plus, TrendingUp, TrendingDown, Trash2, CheckCircle2, StickyNote, Edit3,
  X, Save, CloudSun, CloudRain, Wind, MapPin, Sparkles, MessageSquare,
  Camera, Send, Loader2, RefreshCw, Sun, Cloud, ChevronRight, BookMarked,
  Bell, BrainCircuit, Microscope, Info, Menu
} from 'lucide-react';

// --- 1. CẤU HÌNH KẾT NỐI API ---
//const supabaseUrl = ''; 
//const supabaseAnonKey = ''; 

// Giả lập client cho môi trường xem trước (Preview)
// Khi chạy thực tế: const supabase = createClient(supabaseUrl, supabaseAnonKey);
//const supabase = null; 

// Khóa API Gemini
const apiKey = "AIzaSyBw7vzlZ8ypfqVVyl8zBTsZBzULzN51q-I"; 

// --- HELPER: GỌI API VỚI EXPONENTIAL BACKOFF ---
const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
};

// --- DỮ LIỆU KIẾN THỨC MẶC ĐỊNH ---
const KNOWLEDGE_BASE = [
  { id: 1, category: "Canh tác", title: "Giai đoạn kiến thiết cơ bản", content: "Tập trung tạo tán, bón phân hữu cơ (5-10kg/gốc) để phát triển bộ rễ mạnh khỏe.", details: "Trong 3 năm đầu, việc tạo hình đa thân hoặc đơn thân có ý nghĩa quyết định đến năng suất sau này. Cần chú trọng bón lân để kích thích ra rễ và giữ độ ẩm đất ổn định." },
  { id: 2, category: "Tưới tiêu", title: "Tưới tiết kiệm mùa khô", content: "Sử dụng hệ thống tưới nhỏ giọt. Lượng nước 400-600 lít/gốc/đợt tưới.", details: "Tưới nước đủ giúp cây cà phê phân hóa mầm hoa tốt. Nếu thiếu nước vào giai đoạn này, hoa sẽ bị 'chanh' (không nở được), dẫn đến tỷ lệ đậu quả cực thấp." },
  { id: 3, category: "Bảo vệ thực vật", title: "Phòng trừ Rệp sáp", content: "Kiểm tra kỹ nách lá và chùm quả. Sử dụng chế phẩm sinh học khi mật độ cao.", details: "Rệp sáp thường đi kèm với kiến cộng sinh. Cần dọn sạch cỏ gốc, diệt kiến và phun chế phẩm dầu neem hoặc nấm xanh nấm trắng khi thấy rệp xuất hiện ở mật độ cao." },
  { id: 4, category: "Canh tác", title: "Kỹ thuật cắt cành tạo tán", content: "Tỉa bỏ cành già, cành sâu bệnh, cành vô hiệu sau thu hoạch để cây tập trung dinh dưỡng.", details: "Nên thực hiện cắt cành vào ngày nắng ráo. Loại bỏ các cành mọc ngược, cành tăm để tán cây thông thoáng, giúp ánh sáng lọt vào bên trong tán, giảm thiểu sâu bệnh." }
];

// --- COMPONENT THỜI TIẾT ---
const WeatherWidget = ({ isMobile = false }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=12.6667&longitude=108.0500&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
      const data = await response.json();
      setWeather(data.current);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchWeather(); }, []);

  if (loading) return <div className="h-28 bg-slate-50 rounded-3xl animate-pulse" />;

  return (
    <div className={`rounded-3xl border border-emerald-50 shadow-sm p-5 text-left ${isMobile ? 'bg-white' : 'bg-slate-50/50'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-emerald-600 font-black"><MapPin size={12} /><span className="text-[10px] uppercase tracking-wider">Đắk Lắk</span></div>
        <button onClick={fetchWeather} className="text-slate-300 hover:text-emerald-500 transition-colors"><RefreshCw size={12} /></button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-start"><span className="text-3xl font-black text-slate-800">{Math.round(weather?.temperature_2m || 0)}</span><span className="text-sm font-black text-slate-400 mt-1">°C</span></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Hiện tại</p>
        </div>
        <div className="p-2.5 bg-white rounded-2xl shadow-sm"><Sun className="text-orange-400" size={24} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2"><Droplets size={12} className="text-blue-400" /><p className="text-[10px] font-black text-slate-700">{weather?.relative_humidity_2m}%</p></div>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-100"><Wind size={12} className="text-slate-400" /><p className="text-[10px] font-black text-slate-700">{Math.round(weather?.wind_speed_10m || 0)}k/h</p></div>
      </div>
    </div>
  );
};

// --- COMPONENT CÂY CÀ PHÊ TƯƠNG TÁC ---
const InteractiveTree = ({ tasks, onToggleTask }) => {
  const isWatering = tasks.find(t => t.type === 'Tưới nước' && !t.completed);
  const isFertilizing = tasks.find(t => t.type === 'Bón phân' && !t.completed);
  
  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-50/30 via-transparent to-transparent opacity-50" />
      <svg viewBox="0 0 200 200" className="w-56 h-56 md:w-72 md:h-72 relative z-10 drop-shadow-2xl">
        <ellipse cx="100" cy="185" rx="40" ry="8" fill="#1B5E20" opacity="0.1" />
        <path d="M96 185 Q100 190 104 185 L102 120 Q100 115 98 120 Z" fill="#5D4037" />
        <circle cx="100" cy="85" r="45" fill="#2E7D32" />
        <circle cx="75" cy="115" r="35" fill="#388E3C" />
        <circle cx="125" cy="110" r="38" fill="#43A047" />
        <g fill="#D32F2F"><circle cx="85" cy="100" r="4" /><circle cx="115" cy="115" r="4" /><circle cx="100" cy="70" r="4" /></g>
      </svg>
      <div className="absolute inset-0 p-8 flex flex-col justify-between items-center pointer-events-none z-20">
        <button onClick={() => isWatering && onToggleTask(isWatering.id, isWatering.completed)} className={`pointer-events-auto flex flex-col items-center transition-all ${isWatering ? 'animate-bounce cursor-pointer' : 'opacity-20 grayscale'}`}>
          <div className="w-12 h-12 bg-blue-500 rounded-2xl shadow-xl flex items-center justify-center text-white border-4 border-white"><Droplets size={24} /></div>
          <span className="mt-1 text-[8px] font-black text-blue-600 bg-white/90 px-2 py-0.5 rounded-full uppercase">Tưới nước</span>
        </button>
        <button onClick={() => isFertilizing && onToggleTask(isFertilizing.id, isFertilizing.completed)} className={`pointer-events-auto flex flex-col items-center transition-all ${isFertilizing ? 'animate-bounce cursor-pointer' : 'opacity-20 grayscale'}`}>
          <div className="w-12 h-12 bg-orange-500 rounded-2xl shadow-xl flex items-center justify-center text-white border-4 border-white"><Sprout size={24} /></div>
          <span className="mt-1 text-[8px] font-black text-orange-600 bg-white/90 px-2 py-0.5 rounded-full uppercase">Bón phân</span>
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH APP ---
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // States dữ liệu
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);

  // States UI Modals
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingFinance, setIsAddingFinance] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeKnowledge, setActiveKnowledge] = useState(null);
  
  const [financeForm, setFinanceForm] = useState({ type: 'Chi', category: '', quantity: '', unitPrice: '', date: new Date().toISOString().split('T')[0], note: '' });
  const [taskForm, setTaskForm] = useState({ type: 'Tưới nước', date: new Date().toISOString().split('T')[0], priority: 'Trung bình', note: '' });
  const [noteForm, setNoteForm] = useState({ title: '', content: '', category: 'Nhắc nhở' });

  // States AI
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChat, setAiChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");

  // --- TẢI DỮ LIỆU (Hỗ trợ Offline Mode bằng Local Storage) ---
  useEffect(() => {
    const fetchData = async () => {
      // Nếu chưa cấu hình Supabase, dùng Local Storage để lưu trữ trải nghiệm
      if (!supabase) {
        const localF = JSON.parse(localStorage.getItem('mcf_finance'));
        const localT = JSON.parse(localStorage.getItem('mcf_tasks'));
        const localN = JSON.parse(localStorage.getItem('mcf_notes'));

        if (localF) setExpenses(localF);
        else setExpenses([
          { id: 1, type: 'Chi', category: 'PHÂN BÓN NPK', quantity: 10, unit_price: 750000, amount: 7500000, date: '2024-03-15' },
          { id: 2, type: 'Thu', category: 'BÁN CÀ PHÊ NHÂN', quantity: 250, unit_price: 100000, amount: 25000000, date: '2024-01-20' }
        ]);

        if (localT) setTasks(localT);
        else setTasks([
          { id: 1, type: 'Tưới nước', date: '2024-04-10', completed: false, priority: 'Cao', note: 'Lô A' },
          { id: 2, type: 'Bón phân', date: '2024-04-15', completed: false, priority: 'Trung bình', note: 'Lô B' }
        ]);

        if (localN) setNotes(localN);
        else setNotes([{ id: 1, title: 'KIỂM TRA VƯỜN', content: 'Gốc khu Tây có dấu hiệu rệp sáp', date: '05/04', category: 'Quan trọng' }]);

        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const [f, t, n] = await Promise.all([
          supabase.from('finance').select('*').order('date', { ascending: false }),
          supabase.from('tasks').select('*').order('date', { ascending: true }),
          supabase.from('notes').select('*').order('created_at', { ascending: false })
        ]);
        if (f.data) setExpenses(f.data);
        if (t.data) setTasks(t.data);
        if (n.data) setNotes(n.data);
      } catch(e) {
         console.error("Lỗi tải dữ liệu", e);
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, []);

  // --- LƯU TRỮ LOCAL STORAGE HELPER ---
  const saveToLocal = (key, data) => {
    if (!supabase) localStorage.setItem(key, JSON.stringify(data));
  };

  // --- LOGIC XỬ LÝ (Tương thích cả Offline và Supabase) ---
  const handleSaveFinance = async () => {
    if (!financeForm.category) return;
    const amount = Number(financeForm.quantity) * Number(financeForm.unitPrice);
    const newRecord = {
      type: financeForm.type,
      category: financeForm.category.toUpperCase(),
      quantity: Number(financeForm.quantity),
      unit_price: Number(financeForm.unitPrice),
      amount,
      date: financeForm.date
    };

    if (supabase) {
      const { data, error } = await supabase.from('finance').insert([newRecord]).select();
      if (!error && data) setExpenses([data[0], ...expenses]);
    } else {
      const updated = [{ id: Date.now(), ...newRecord }, ...expenses];
      setExpenses(updated);
      saveToLocal('mcf_finance', updated);
    }
    
    setIsAddingFinance(false);
    setFinanceForm({ type: 'Chi', category: '', quantity: '', unitPrice: '', date: new Date().toISOString().split('T')[0], note: '' });
  };

  const deleteFinance = async (id) => {
    if (supabase) await supabase.from('finance').delete().eq('id', id);
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveToLocal('mcf_finance', updated);
  };

  const handleSaveTask = async () => {
    if (supabase) {
      const { data, error } = await supabase.from('tasks').insert([taskForm]).select();
      if (!error && data) setTasks([...tasks, data[0]]);
    } else {
      const updated = [...tasks, { id: Date.now(), completed: false, ...taskForm }];
      setTasks(updated);
      saveToLocal('mcf_tasks', updated);
    }
    setIsAddingTask(false);
  };

  const toggleTask = async (id, currentStatus) => {
    if (supabase) await supabase.from('tasks').update({ completed: !currentStatus }).eq('id', id);
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t);
    setTasks(updated);
    saveToLocal('mcf_tasks', updated);
  };

  const deleteTask = async (id) => {
    if (supabase) await supabase.from('tasks').delete().eq('id', id);
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveToLocal('mcf_tasks', updated);
  };

  const handleSaveNote = async () => {
    if (!noteForm.title) return;
    const record = { ...noteForm, date: new Date().toLocaleDateString('vi-VN') };
    if (supabase) {
      const { data, error } = await supabase.from('notes').insert([record]).select();
      if (!error && data) setNotes([data[0], ...notes]);
    } else {
      const updated = [{ id: Date.now(), ...record }, ...notes];
      setNotes(updated);
      saveToLocal('mcf_notes', updated);
    }
    setIsAddingNote(false);
    setNoteForm({ title: '', content: '', category: 'Nhắc nhở' });
  };

  const deleteNote = async (id) => {
    if (supabase) await supabase.from('notes').delete().eq('id', id);
    const updated = notes.filter(x => x.id !== id);
    setNotes(updated);
    saveToLocal('mcf_notes', updated);
  }

  // --- LOGIC AI GEMINI ---
  const callGemini = async (prompt, systemInstruction = "Bạn là chuyên gia nông nghiệp.") => {
    try {
      const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi.";
    } catch {
      return "Lỗi kết nối AI. Kiểm tra API Key.";
    }
  }

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setAiChat(prev => [...prev, userMsg]);
    setChatInput("");
    setIsAiLoading(true);
    const response = await callGemini(userMsg.text, "Chuyên gia cà phê Việt Nam, trả lời cực ngắn gọn.");
    setAiChat(prev => [...prev, { role: 'ai', text: response }]);
    setIsAiLoading(false);
  };

  const handleDiagnose = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsDiagnosing(true);
    setDiagnosisResult("");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      try {
        const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [
              { text: "Hãy chẩn đoán bệnh cây cà phê trong ảnh này và gợi ý cách xử lý ngắn gọn." }, 
              { inlineData: { mimeType: file.type, data: base64Data } }
            ]}]
          })
        });
        setDiagnosisResult(result.candidates?.[0]?.content?.parts?.[0]?.text);
      } catch { setDiagnosisResult("Lỗi phân tích hình ảnh."); }
      finally { setIsDiagnosing(false); }
    };
    reader.readAsDataURL(file);
  };

  const analyzeFinance = async () => {
    setIsAiLoading(true);
    const summary = expenses.map(e => `${e.date}: ${e.type} ${e.category} (${e.amount}đ)`).join('\n');
    const prompt = `Thu chi:\n${summary}\nLợi nhuận: ${stats.loiNhuan}đ. Gợi ý tối ưu chi phí ngắn gọn.`;
    const res = await callGemini(prompt, "Chuyên gia tài chính nông nghiệp.");
    setAiAnalysis(res);
    setIsAiLoading(false);
  }

  // --- THỐNG KÊ TÀI CHÍNH ---
  const stats = useMemo(() => {
    const chi = expenses.filter(e => e.type === 'Chi').reduce((s, e) => s + Number(e.amount || 0), 0);
    const thu = expenses.filter(e => e.type === 'Thu').reduce((s, e) => s + Number(e.amount || 0), 0);
    return { chi, thu, loiNhuan: thu - chi };
  }, [expenses]);

  const SidebarItem = ({ id, icon: Icon, label, ai = false }) => (
    <button onClick={() => {setActiveTab(id); setIsMenuOpen(false);}} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
      <div className="flex items-center space-x-3 text-left"><Icon size={18} /><span className="font-bold text-sm">{label}</span></div>
      {ai && <Sparkles size={12} className={activeTab === id ? 'text-yellow-300' : 'text-emerald-500'} />}
    </button>
  );

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="animate-spin text-emerald-600" size={48} />
      <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden text-left">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-white border-b p-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 font-black text-sm uppercase">
          <div className="bg-emerald-100 p-1.5 rounded-lg"><Sprout className="text-emerald-600" size={18} /></div>
          My Coffee Farm
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="p-2 bg-slate-50 rounded-xl"><Menu size={20} /></button>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white p-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
             <div className="flex justify-between items-center mb-8 border-b pb-4"><span className="font-black text-emerald-600 uppercase text-xs tracking-widest">Menu</span><button onClick={() => setIsMenuOpen(false)}><X size={20} /></button></div>
             <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
              <SidebarItem id="dashboard" icon={LayoutDashboard} label="Bảng điều khiển" />
              <SidebarItem id="care" icon={Droplets} label="Chăm sóc" />
              <SidebarItem id="finance" icon={CircleDollarSign} label="Tài chính" />
              <SidebarItem id="notes" icon={StickyNote} label="Ghi chú" />
              <SidebarItem id="knowledge" icon={BookOpen} label="Kiến thức" />
              <div className="h-px bg-slate-100 my-2" />
              <SidebarItem id="ai-chat" icon={MessageSquare} label="Hỏi ✨ AI" ai />
              <SidebarItem id="ai-vision" icon={Camera} label="Soi bệnh ✨ AI" ai />
             </nav>
             <div className="mt-4"><WeatherWidget isMobile /></div>
          </div>
        </div>
      )}

      {/* PC SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-shrink-0 flex-col sticky top-0 h-screen">
        <div className="flex items-center space-x-3 mb-10 px-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="bg-emerald-100 p-2.5 rounded-2xl"><Sprout size={24} className="text-emerald-600" /></div>
          <div><h1 className="text-sm font-black text-slate-800 uppercase leading-none">My Coffee</h1><p className="text-[11px] font-black text-emerald-500 uppercase mt-1">Farm</p></div>
        </div>
        <nav className="space-y-1.5 flex-1 pr-2 overflow-y-auto scrollbar-hide">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Bảng điều khiển" />
          <SidebarItem id="care" icon={Droplets} label="Chăm sóc" />
          <SidebarItem id="finance" icon={CircleDollarSign} label="Tài chính" />
          <SidebarItem id="notes" icon={StickyNote} label="Ghi chú" />
          <SidebarItem id="knowledge" icon={BookOpen} label="Kiến thức" />
          <div className="h-px bg-slate-100 my-4" />
          <SidebarItem id="ai-chat" icon={MessageSquare} label="Hỏi ✨ AI" ai />
          <SidebarItem id="ai-vision" icon={Camera} label="Soi bệnh ✨ AI" ai />
        </nav>
        <div className="mt-6"><WeatherWidget /></div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 transition-all w-full overflow-hidden">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Chào buổi sáng! ✨</h2>
                <p className="text-slate-400 font-bold text-xs mt-1">Tổng quan tình hình vườn cà phê hôm nay.</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><Bell size={16} /></div>
                 <div className="text-right leading-none">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Thông báo</p>
                    <p className="text-xs font-bold text-slate-700 uppercase">{tasks.filter(t=>!t.completed).length} việc cần làm</p>
                 </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chi đầu tư</p><TrendingDown className="text-red-400" size={14} /></div>
                <h3 className="text-lg md:text-xl font-black text-red-500">{new Intl.NumberFormat('vi-VN').format(stats.chi)} đ</h3>
              </div>
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doanh thu</p><TrendingUp className="text-emerald-400" size={14} /></div>
                <h3 className="text-lg md:text-xl font-black text-emerald-600">{new Intl.NumberFormat('vi-VN').format(stats.thu)} đ</h3>
              </div>
              <div className="bg-emerald-600 p-6 rounded-[28px] text-white shadow-xl shadow-emerald-100 group">
                <div className="flex justify-between items-start mb-2"><p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Lợi nhuận</p><CircleDollarSign className="opacity-60" size={14} /></div>
                <h3 className="text-lg md:text-xl font-black">{new Intl.NumberFormat('vi-VN').format(stats.loiNhuan)} đ</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mô phỏng vườn thực tế</h3>
                   <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />TRỰC TUYẾN</span>
                </div>
                <InteractiveTree tasks={tasks} onToggleTask={toggleTask} />
              </div>
              
              <div className="lg:col-span-4 space-y-6">
                {/* Tiện ích Việc sắp tới */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Việc sắp tới</h3>
                     <button onClick={() => setActiveTab('care')} className="text-[9px] font-black text-emerald-500 hover:underline uppercase bg-emerald-50 px-2 py-1 rounded-md">Xem tất cả</button>
                  </div>
                  <div className="space-y-4">
                    {tasks.filter(t => !t.completed).slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleTask(t.id, t.completed)}>
                        <div className={`p-2.5 rounded-2xl transition-colors ${t.type === 'Tưới nước' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' : 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'}`}>
                          {t.type === 'Tưới nước' ? <Droplets size={18} /> : <Sprout size={18} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-800 uppercase leading-none mb-1 group-hover:text-emerald-600 transition-colors">{t.type}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{t.date} • <span className={`${t.priority === 'Cao' ? 'text-red-400' : ''}`}>{t.priority}</span></p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                           <CheckCircle2 size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => !t.completed).length === 0 && (
                      <div className="text-center py-6">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-3 opacity-30" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đã hoàn thành mọi việc!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tiện ích Ghi chú gần nhất */}
                <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveTab('notes')}>
                   <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform"><StickyNote size={80} className="text-emerald-600" /></div>
                   <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-4 relative z-10 flex items-center gap-2"><StickyNote size={14}/> Ghi chú gần nhất</h3>
                   {notes.length > 0 ? (
                     <div className="relative z-10">
                       <h4 className="text-sm font-black text-emerald-900 mb-1.5 uppercase">{notes[0].title}</h4>
                       <p className="text-xs text-emerald-700/80 line-clamp-2 italic font-medium leading-relaxed">"{notes[0].content}"</p>
                       <div className="flex items-center justify-between mt-4">
                         <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-100/50 px-2 py-1 rounded-md">{notes[0].category}</span>
                         <span className="text-[9px] font-bold text-emerald-600/60 uppercase">{notes[0].date}</span>
                       </div>
                     </div>
                   ) : (
                     <p className="text-[10px] font-bold text-emerald-600/60 uppercase relative z-10">Chưa có ghi chú nào.</p>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TÀI CHÍNH */}
        {activeTab === 'finance' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
            <header className="flex justify-between items-center px-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Tài chính</h2>
              <div className="flex gap-2">
                <button onClick={analyzeFinance} className="hidden sm:flex bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase items-center gap-2 hover:bg-emerald-100 transition-colors">
                  {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <BrainCircuit size={14} />} Phân tích AI
                </button>
                <button onClick={() => setIsAddingFinance(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:scale-105 transition-all">Ghi Thu Chi</button>
              </div>
            </header>
            
            {aiAnalysis && (
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest"><Sparkles size={14} /> Phân tích AI</div>
                <div className="text-xs text-emerald-900 leading-relaxed font-medium whitespace-pre-wrap">{aiAnalysis}</div>
                <button onClick={() => setAiAnalysis("")} className="mt-3 text-[8px] font-black text-emerald-500 uppercase">Đóng</button>
              </div>
            )}

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto w-full">
              <table className="w-full min-w-[700px]">
                <thead><tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50"><th className="p-6 text-left">Hạng mục</th><th className="p-6 text-center">SL</th><th className="p-6 text-right">Đơn giá</th><th className="p-6 text-right">Thành tiền</th><th className="p-6 text-center">Ngày</th><th className="p-6"></th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {expenses.map(e => (
                    <tr key={e.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                           <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${e.type === 'Chi' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>{e.type}</span>
                           <span className="font-bold text-xs text-slate-700 uppercase">{e.category}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center text-xs font-bold text-slate-400">{e.quantity}</td>
                      <td className="p-6 text-right text-xs font-bold text-slate-400">{new Intl.NumberFormat('vi-VN').format(e.unit_price || e.unitPrice)} đ</td>
                      <td className={`p-6 text-right font-black text-sm ${e.type === 'Chi' ? 'text-slate-800' : 'text-emerald-600'}`}>{new Intl.NumberFormat('vi-VN').format(e.amount)} đ</td>
                      <td className="p-6 text-center text-[9px] font-black text-slate-300">{e.date}</td>
                      <td className="p-6 text-right px-6"><button onClick={() => deleteFinance(e.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {expenses.length === 0 && <p className="py-20 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">Chưa có dữ liệu</p>}
            </div>
          </div>
        )}

        {/* TAB 3: CHĂM SÓC */}
        {activeTab === 'care' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            <header className="flex justify-between items-center px-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Lịch trình</h2>
              <button onClick={() => setIsAddingTask(true)} className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg hover:scale-105 transition-all"><Plus size={20} /></button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.filter(t => !t.completed).map(t => (
                <div key={t.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'Tưới nước' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}><Droplets size={20} /></div>
                    <div>
                      <div className="flex items-center gap-2"><span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase ${t.priority === 'Cao' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>{t.priority}</span><span className="text-[9px] font-bold text-slate-300 uppercase">{t.date}</span></div>
                      <h4 className="font-black text-xs uppercase text-slate-800 mt-1">{t.type}</h4>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleTask(t.id, t.completed)} className="p-2.5 bg-slate-50 text-slate-300 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle2 size={18} /></button>
                    <button onClick={() => deleteTask(t.id)} className="p-2.5 bg-slate-50 text-slate-300 rounded-xl hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => !t.completed).length === 0 && <p className="col-span-full text-center text-slate-300 py-10 uppercase text-xs font-black tracking-widest italic">Vườn đã được chăm sóc đầy đủ!</p>}
            </div>
          </div>
        )}

        {/* TAB 4: GHI CHÚ */}
        {activeTab === 'notes' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
             <header className="flex justify-between items-center px-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Sổ tay Cloud</h2>
                <button onClick={() => setIsAddingNote(true)} className="bg-emerald-600 text-white p-2.5 rounded-xl"><Plus size={20} /></button>
             </header>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(n => (
                  <div key={n.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col hover:border-emerald-200 transition-all relative group">
                     <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-50 text-emerald-600">{n.category}</span>
                        <button onClick={() => deleteNote(n.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                     </div>
                     <h4 className="font-black text-xs text-slate-800 uppercase mb-2">{n.title}</h4>
                     <p className="text-xs text-slate-500 italic flex-1">"{n.content}"</p>
                     <div className="pt-3 border-t border-slate-50 text-[9px] font-black text-slate-300 mt-4 uppercase">{n.date}</div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB 5: KIẾN THỨC */}
        {activeTab === 'knowledge' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in text-left">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter px-2">Thư viện Kỹ thuật</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {KNOWLEDGE_BASE.map(item => (
                <div key={item.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><BookOpen size={24} /></div><h3 className="text-sm font-black text-slate-800 uppercase mt-1 leading-none">{item.title}</h3></div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 flex-1">{item.content}</p>
                  <button onClick={() => setActiveKnowledge(item)} className="w-full py-3 bg-slate-50 text-slate-800 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">Chi tiết <ChevronRight size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AI CHAT */}
        {activeTab === 'ai-chat' && (
          <div className="max-w-4xl mx-auto h-[75vh] flex flex-col animate-in fade-in">
            <div className="flex-1 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
               <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {aiChat.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-200 opacity-60"><BrainCircuit size={64} className="mb-4" /><p className="font-black text-[10px] uppercase tracking-widest">Hỏi AI về kỹ thuật canh tác</p></div>}
                  {aiChat.map((c, i) => (
                    <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${c.role === 'user' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 font-medium'}`}>{c.text}</div>
                    </div>
                  ))}
                  {isAiLoading && <div className="flex justify-start"><Loader2 className="animate-spin text-emerald-500" /></div>}
               </div>
               <div className="p-4 bg-slate-50 border-t flex gap-2">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="Nhập câu hỏi tại đây..." className="flex-1 bg-white border border-slate-200 p-4 rounded-xl text-sm outline-none focus:border-emerald-500 font-bold" />
                  <button onClick={handleSendChat} className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg"><Send size={20} /></button>
               </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI VISION */}
        {activeTab === 'ai-vision' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-12 rounded-[40px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center relative hover:border-emerald-200 transition-all cursor-pointer group text-center">
                <input type="file" accept="image/*" onChange={handleDiagnose} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="p-6 bg-emerald-50 text-emerald-500 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform"><Camera size={48} /></div>
                <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Tải ảnh vùng bệnh</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase italic">Chụp lá, quả hoặc thân cây</p>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm min-h-[350px] flex flex-col">
                <div className="flex items-center justify-between mb-6"><h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kết quả chẩn đoán ✨ AI</h3><Sparkles size={16} className="text-yellow-400" /></div>
                {isDiagnosing ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center"><Loader2 className="animate-spin text-emerald-500" size={40} /><span className="text-[10px] font-black text-emerald-600 animate-pulse uppercase tracking-widest">Đang quét ảnh...</span></div>
                ) : (
                  <div className="flex-1 overflow-y-auto font-medium text-sm text-slate-600 leading-loose whitespace-pre-wrap">{diagnosisResult || "Vui lòng tải ảnh lên để AI phân tích."}</div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- MODALS (ĐƠN GIẢN, GỌN GÀNG) --- */}
      
      {/* 1. Modal Lên Lịch */}
      {isAddingTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddingTask(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 border border-slate-100">
            <div className="flex justify-between items-center mb-6"><h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">Lên lịch mới</h3><button onClick={() => setIsAddingTask(false)}><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Công việc</label><select value={taskForm.type} onChange={e => setTaskForm({...taskForm, type: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs uppercase outline-none"><option value="Tưới nước">Tưới nước</option><option value="Bón phân">Bón phân</option><option value="Cắt cành">Cắt cành</option></select></div>
              <div><label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Ngày</label><input type="date" value={taskForm.date} onChange={e => setTaskForm({...taskForm, date: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs outline-none" /></div>
              <div><label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Ưu tiên</label><select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs uppercase outline-none"><option value="Thấp">Thấp</option><option value="Trung bình">Trung bình</option><option value="Cao">Cao</option></select></div>
              <textarea rows="2" value={taskForm.note} onChange={e => setTaskForm({...taskForm, note: e.target.value})} placeholder="Ghi chú..." className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none" />
              <button onClick={handleSaveTask} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Lưu lại</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Thu Chi */}
      {isAddingFinance && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddingFinance(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 border border-slate-100">
             <div className="flex justify-between items-center mb-6"><h3 className="font-black text-slate-800 uppercase text-sm">Ghi thu chi</h3><button onClick={() => setIsAddingFinance(false)}><X size={20} /></button></div>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
                 <button onClick={() => setFinanceForm({...financeForm, type: 'Thu'})} className={`py-2 rounded-lg text-[9px] font-black uppercase ${financeForm.type === 'Thu' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Thu</button>
                 <button onClick={() => setFinanceForm({...financeForm, type: 'Chi'})} className={`py-2 rounded-lg text-[9px] font-black uppercase ${financeForm.type === 'Chi' ? 'bg-white shadow-sm text-red-500' : 'text-slate-400'}`}>Chi</button>
               </div>
               <input type="text" placeholder="Hạng mục..." value={financeForm.category} onChange={e => setFinanceForm({...financeForm, category: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs uppercase outline-none" />
               <div className="grid grid-cols-2 gap-4">
                 <input type="number" placeholder="Số lượng" value={financeForm.quantity} onChange={e => setFinanceForm({...financeForm, quantity: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none" />
                 <input type="number" placeholder="Đơn giá" value={financeForm.unitPrice} onChange={e => setFinanceForm({...financeForm, unitPrice: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none" />
               </div>
               <input type="date" value={financeForm.date} onChange={e => setFinanceForm({...financeForm, date: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs outline-none" />
               <button onClick={handleSaveFinance} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Xác nhận</button>
             </div>
          </div>
        </div>
      )}

      {/* 3. Modal Ghi chú */}
      {isAddingNote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddingNote(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 border border-slate-100">
            <div className="flex justify-between items-center mb-6"><h3 className="font-black text-slate-800 uppercase text-sm">Ghi chú mới</h3><button onClick={() => setIsAddingNote(false)}><X size={20} /></button></div>
            <div className="space-y-4">
              <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs uppercase outline-none" onChange={e => setNoteForm({...noteForm, category: e.target.value})}><option value="Nhắc nhở">Nhắc nhở</option><option value="Quan trọng">Quan trọng</option><option value="Ý tưởng">Ý tưởng</option></select>
              <input type="text" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value.toUpperCase()})} placeholder="Tiêu đề..." className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-xs uppercase outline-none" />
              <textarea rows="4" value={noteForm.content} onChange={e => setNoteForm({...noteForm, content: e.target.value})} placeholder="Nội dung..." className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none" />
              <button onClick={handleSaveNote} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Lưu lại</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Chi tiết Kiến thức */}
      {activeKnowledge && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setActiveKnowledge(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><BookMarked size={24} /></div><h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">{activeKnowledge.title}</h3></div>
            <p className="text-sm text-slate-800 leading-loose font-medium bg-slate-50 p-6 rounded-3xl">{activeKnowledge.details}</p>
            <button onClick={() => setActiveKnowledge(null)} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Đã hiểu</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
