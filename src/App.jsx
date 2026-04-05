import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Sprout, 
  CircleDollarSign, 
  BookOpen, 
  Calendar,
  Plus,
  TrendingUp,
  TrendingDown,
  Trash2, 
  CheckCircle2,
  AlertCircle,
  StickyNote,
  Edit3,
  X,
  Save,
  CloudSun,
  CloudRain,
  Wind,
  Navigation,
  MapPin,
  Sparkles,
  MessageSquare,
  Camera,
  Send,
  Loader2,
  History,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  RefreshCw,
  Sun,
  Cloud,
  CloudLightning,
  ChevronRight,
  BookMarked,
  Bell
} from 'lucide-react';

const apiKey = ""; // API key được cung cấp tại runtime

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

const KNOWLEDGE_BASE = [
  { 
    id: 1, 
    category: "Kỹ thuật", 
    title: "Giai đoạn kiến thiết cơ bản", 
    content: "Tập trung tạo tán, bón phân hữu cơ (5-10kg/gốc) để phát triển bộ rễ. Cắt cành tạo hình giúp cây thông thoáng.",
    details: "Trong 3 năm đầu, việc tạo hình đa thân hoặc đơn thân có ý nghĩa quyết định đến năng suất sau này. Cần chú trọng bón lân để kích thích ra rễ và giữ độ ẩm đất ổn định."
  },
  { 
    id: 2, 
    category: "Tưới nước", 
    title: "Tưới tiết kiệm mùa khô", 
    content: "Sử dụng hệ thống tưới nhỏ giọt. Lượng nước 400-600 lít/gốc/đợt tưới, chu kỳ 15-20 ngày.",
    details: "Tưới nước đủ giúp cây cà phê phân hóa mầm hoa tốt. Nếu thiếu nước, hoa sẽ bị 'chanh', không đậu quả."
  },
  { 
    id: 3, 
    category: "Bệnh hại", 
    title: "Phòng trừ Rệp sáp", 
    content: "Kiểm tra kỹ nách lá và chùm quả. Sử dụng chế phẩm sinh học khi mật độ cao vào mùa khô.",
    details: "Rệp sáp thường đi kèm với kiến. Cần dọn sạch cỏ gốc và phun thuốc khi thấy rệp xuất hiện ở mật độ cao."
  }
];

// Thành phần Thời tiết chi tiết
const WeatherWidget = ({ isMobile = false }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Vườn cà phê");

  const getWeatherInfo = (code) => {
    if (code === 0) return { label: "Nắng ráo", icon: <Sun className="text-orange-400" size={24} /> };
    if (code >= 1 && code <= 3) return { label: "Nhiều mây", icon: <CloudSun className="text-yellow-500" size={24} /> };
    if (code >= 45 && code <= 48) return { label: "Sương mù", icon: <Cloud className="text-slate-400" size={24} /> };
    if (code >= 51 && code <= 67) return { label: "Có mưa", icon: <CloudRain className="text-blue-500" size={24} /> };
    return { label: "Ổn định", icon: <CloudSun className="text-emerald-500" size={24} /> };
  };

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
      const data = await response.json();
      setWeather(data.current);
      setLocationName(lat > 12 && lat < 13 ? "Đắk Lắk" : "Lâm Đồng");
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  useEffect(() => {
    fetchWeather(12.6667, 108.0500);
  }, []);

  if (loading) return <div className="h-28 bg-slate-50 rounded-3xl animate-pulse" />;
  const info = getWeatherInfo(weather?.weather_code);

  return (
    <div className={`rounded-3xl border border-emerald-50 shadow-sm p-5 text-left ${isMobile ? 'bg-white' : 'bg-slate-50/50'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-emerald-600 font-black">
          <MapPin size={12} />
          <span className="text-[10px] font-black uppercase tracking-wider">{locationName}</span>
        </div>
        <button onClick={() => fetchWeather(12.6667, 108.0500)} className="text-slate-300 hover:text-emerald-500 transition-colors"><RefreshCw size={12} /></button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-start"><span className="text-3xl font-black text-slate-800 tracking-tighter">{Math.round(weather?.temperature_2m)}</span><span className="text-sm font-black text-slate-400 mt-1">°C</span></div>
          <p className="text-[11px] font-bold text-slate-500 uppercase">{info.label}</p>
        </div>
        <div className="p-2.5 bg-white rounded-2xl shadow-sm">{info.icon}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2"><Droplets size={12} className="text-blue-400" /><p className="text-[10px] font-black text-slate-700">{weather?.relative_humidity_2m}%</p></div>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-100"><Wind size={12} className="text-slate-400" /><p className="text-[10px] font-black text-slate-700">{Math.round(weather?.wind_speed_10m)}k/h</p></div>
      </div>
    </div>
  );
};

// Cây Cà Phê Tương Tác
const InteractiveTree = ({ tasks, onToggleTask }) => {
  const isWatering = tasks.find(t => t.type === 'Tưới nước' && !t.completed);
  const isFertilizing = tasks.find(t => t.type === 'Bón phân' && !t.completed);
  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-50/40 via-transparent to-transparent opacity-50" />
      <svg viewBox="0 0 200 200" className="w-56 h-56 md:w-72 md:h-72 relative z-10 drop-shadow-xl">
        <ellipse cx="100" cy="185" rx="40" ry="8" fill="#1B5E20" opacity="0.1" />
        <path d="M96 185 Q100 190 104 185 L102 120 Q100 115 98 120 Z" fill="#5D4037" />
        <circle cx="100" cy="85" r="45" fill="#2E7D32" /><circle cx="75" cy="115" r="35" fill="#388E3C" /><circle cx="125" cy="110" r="38" fill="#43A047" />
        <g fill="#D32F2F"><circle cx="85" cy="100" r="4" /><circle cx="115" cy="115" r="4" /><circle cx="100" cy="70" r="4" /></g>
      </svg>
      <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between items-center pointer-events-none z-20">
        <button onClick={() => isWatering && onToggleTask(isWatering.id)} className={`pointer-events-auto flex flex-col items-center transition-all ${isWatering ? 'animate-bounce' : 'opacity-20 grayscale'}`}>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500 rounded-2xl shadow-xl flex items-center justify-center text-white border-4 border-white"><Droplets size={24} /></div>
          <span className="mt-1 text-[8px] md:text-[10px] font-black text-blue-600 bg-white/90 px-2 py-0.5 rounded-full uppercase">Tưới nước</span>
        </button>
        <button onClick={() => isFertilizing && onToggleTask(isFertilizing.id)} className={`pointer-events-auto flex flex-col items-center transition-all ${isFertilizing ? 'animate-bounce' : 'opacity-20 grayscale'}`}>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500 rounded-2xl shadow-xl flex items-center justify-center text-white border-4 border-white"><Sprout size={24} /></div>
          <span className="mt-1 text-[8px] md:text-[10px] font-black text-orange-600 bg-white/90 px-2 py-0.5 rounded-full uppercase">Bón phân</span>
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Data States
  const [expenses, setExpenses] = useState([
    { id: 1, type: 'Chi', category: 'PHÂN BÓN NPK', quantity: 10, unitPrice: 750000, amount: 7500000, date: '2024-03-15', note: 'Bón mùa khô' },
    { id: 2, type: 'Chi', category: 'NHÂN CÔNG', quantity: 4, unitPrice: 500000, amount: 2000000, date: '2024-03-01', note: 'Làm cỏ' },
    { id: 3, type: 'Thu', category: 'BÁN CÀ PHÊ', quantity: 250, unitPrice: 100000, amount: 25000000, date: '2023-12-20', note: 'Vụ 2023' }
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, type: 'Tưới nước', date: '2024-04-10', completed: false },
    { id: 2, type: 'Bón phân', date: '2024-04-15', completed: false }
  ]);
  const [notes, setNotes] = useState([
    { id: 1, title: 'KIỂM TRA RỆP SÁP', content: 'Cần kiểm tra kỹ các gốc khu vực phía Tây vì thấy dấu hiệu rệp sáp xuất hiện sớm.', date: '05/04' },
    { id: 2, title: 'DỰ BÁO GIÁ CÀ PHÊ', content: 'Giá cà phê thế giới đang có xu hướng tăng, nên cân nhắc thời điểm xuất kho.', date: '04/04' }
  ]);
  
  // UI States
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingFinance, setIsAddingFinance] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeKnowledge, setActiveKnowledge] = useState(null);
  const [editingFinanceId, setEditingFinanceId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [financeForm, setFinanceForm] = useState({ type: 'Chi', category: '', quantity: '', unitPrice: '', date: '', note: '' });
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });

  const stats = useMemo(() => {
    const chi = expenses.filter(e => e.type === 'Chi').reduce((s, e) => s + e.amount, 0);
    const thu = expenses.filter(e => e.type === 'Thu').reduce((s, e) => s + e.amount, 0);
    return { chi, thu, loiNhuan: thu - chi };
  }, [expenses]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setIsMenuOpen(false);
    if (id === 'dashboard') { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 500); }
  };

  const askAi = async () => {
    if (!chatInput.trim()) return;
    setAiChat([...aiChat, { role: 'user', text: chatInput }]);
    setChatInput('');
    setIsAiLoading(true);
    try {
      const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: chatInput }] }],
          systemInstruction: { parts: [{ text: "Chuyên gia cà phê Việt Nam. Trình bày ngắn, xuống dòng rõ ràng giữa các ý chính." }] }
        })
      });
      setAiChat(prev => [...prev, { role: 'ai', text: result.candidates?.[0]?.content?.parts?.[0]?.text || "Lỗi." }]);
    } catch (e) { setAiChat(prev => [...prev, { role: 'ai', text: "Lỗi kết nối." }]); }
    finally { setIsAiLoading(false); }
  };

  const [aiChat, setAiChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: "Chẩn đoán bệnh cà phê qua ảnh." }, { inlineData: { mimeType: file.type, data: base64 } }] }] })
        });
        setAnalysisResult(result.candidates?.[0]?.content?.parts?.[0]?.text);
      } catch (err) { setAnalysisResult("Lỗi phân tích."); }
      finally { setIsAnalyzing(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveFinance = () => {
    if (!financeForm.category || !financeForm.date) return;
    const qty = parseFloat(financeForm.quantity) || 1;
    const price = parseFloat(financeForm.unitPrice) || 0;
    const amount = qty * price;
    const data = { ...financeForm, category: financeForm.category.toUpperCase(), quantity: qty, unitPrice: price, amount };
    if (editingFinanceId) setExpenses(expenses.map(e => e.id === editingFinanceId ? { ...e, ...data } : e));
    else setExpenses([{ id: Date.now(), ...data }, ...expenses]);
    setIsAddingFinance(false);
    setEditingFinanceId(null);
  };

  const SidebarItem = ({ id, icon: Icon, label, ai = false }) => (
    <button onClick={() => handleTabChange(id)} className={`w-full flex items-center justify-between p-4 md:p-3.5 rounded-2xl transition-all ${activeTab === id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
      <div className="flex items-center space-x-3 text-left"><Icon size={18} /><span className="font-bold text-sm md:text-xs">{label}</span></div>
      {ai && <Sparkles size={12} className={activeTab === id ? 'text-yellow-300' : 'text-emerald-500'} />}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <button onClick={() => handleTabChange('dashboard')} className="flex items-center gap-2">
          <div className="bg-emerald-100 p-1.5 rounded-lg"><Sprout size={18} className="text-emerald-600" /></div>
          <span className="font-black text-sm uppercase tracking-tight">My Coffee Farm</span>
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-600 bg-slate-50 rounded-xl"><Menu size={20} /></button>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8 border-b pb-4"><span className="font-black text-emerald-600 text-sm tracking-widest uppercase">Danh mục</span><button onClick={() => setIsMenuOpen(false)}><X size={20} /></button></div>
            <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
              <SidebarItem id="dashboard" icon={LayoutDashboard} label="Bảng điều khiển" />
              <SidebarItem id="ai-assistant" icon={MessageSquare} label="Hỏi ✨ AI" ai />
              <SidebarItem id="ai-vision" icon={Camera} label="Soi bệnh ✨ AI" ai />
              <SidebarItem id="care" icon={Droplets} label="Chăm sóc" />
              <SidebarItem id="finance" icon={CircleDollarSign} label="Tài chính" />
              <SidebarItem id="notes" icon={StickyNote} label="Ghi chú" />
              <SidebarItem id="knowledge" icon={BookOpen} label="Kiến thức" />
            </nav>
            <div className="mt-6"><WeatherWidget isMobile /></div>
          </div>
        </div>
      )}

      {/* PC SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-shrink-0 flex-col sticky top-0 h-screen">
        <button onClick={() => handleTabChange('dashboard')} className="flex items-center space-x-3 mb-10 px-2 text-left group">
          <div className="bg-emerald-100 p-2.5 rounded-2xl shadow-sm group-hover:scale-105 transition-transform"><Sprout size={24} className="text-emerald-600" /></div>
          <div><h1 className="text-sm font-black tracking-tight text-slate-800 uppercase leading-none">My Coffee</h1><p className="text-[11px] font-black text-emerald-500 uppercase leading-tight mt-1">Farm</p></div>
        </button>
        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Bảng điều khiển" />
          <SidebarItem id="ai-assistant" icon={MessageSquare} label="Hỏi ✨ AI" ai />
          <SidebarItem id="ai-vision" icon={Camera} label="Soi bệnh ✨ AI" ai />
          <SidebarItem id="care" icon={Droplets} label="Chăm sóc" />
          <SidebarItem id="finance" icon={CircleDollarSign} label="Tài chính" />
          <SidebarItem id="notes" icon={StickyNote} label="Ghi chú" />
          <SidebarItem id="knowledge" icon={BookOpen} label="Kiến thức" />
        </nav>
        <div className="mt-6"><WeatherWidget /></div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-4 md:p-10 transition-opacity duration-300 ${isRefreshing ? 'opacity-30' : 'opacity-100'}`}>
        
        {/* DASHBOARD - RESTORED AS REQUESTED */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Chào buổi sáng! ✨</h2>
                <p className="text-slate-400 font-bold text-xs md:text-sm italic">Hôm nay, vườn của bạn đang trong giai đoạn tốt nhất.</p>
              </div>
              <div className="flex gap-2">
                 <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                   <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><Bell size={16} /></div>
                   <div className="text-right leading-none">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Thông báo</p>
                     <p className="text-xs font-bold text-slate-700 uppercase">{tasks.filter(t=>!t.completed).length} việc cần làm</p>
                   </div>
                 </div>
              </div>
            </header>

            {/* Tài chính tóm tắt */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-left">
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tổng chi đầu tư</p>
                  <TrendingDown className="text-red-400" size={14} />
                </div>
                <h3 className="text-lg md:text-xl font-black text-red-500">{new Intl.NumberFormat('vi-VN').format(stats.chi)} đ</h3>
              </div>
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doanh thu dự kiến</p>
                  <TrendingUp className="text-emerald-400" size={14} />
                </div>
                <h3 className="text-lg md:text-xl font-black text-emerald-600">{new Intl.NumberFormat('vi-VN').format(stats.thu)} đ</h3>
              </div>
              <div className="bg-emerald-600 p-6 rounded-[28px] text-white shadow-xl shadow-emerald-100 group">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Lợi nhuận ròng</p>
                   <ArrowUpRight className="opacity-60" size={14} />
                </div>
                <h3 className="text-lg md:text-xl font-black">{new Intl.NumberFormat('vi-VN').format(stats.loiNhuan)} đ</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Khu vực trung tâm: Cây cà phê */}
              <div className="lg:col-span-8 space-y-4 text-left">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mô phỏng vườn thực tế</h3>
                   <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">LIVE UPDATE</span>
                </div>
                <InteractiveTree tasks={tasks} onToggleTask={(id) => setTasks(tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t))} />
              </div>

              {/* Khu vực bên phải: Cập nhật nhanh */}
              <div className="lg:col-span-4 space-y-6 text-left">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Nhiệm vụ sắp tới</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {tasks.filter(t => !t.completed).map(t => (
                      <div key={t.id} onClick={() => setTasks(tasks.map(x => x.id === t.id ? {...x, completed: true} : x))} className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-emerald-200 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${t.type === 'Tưới nước' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}><Droplets size={16} /></div>
                          <div><p className="text-xs font-black uppercase text-slate-800 mb-0.5">{t.type}</p><p className="text-[9px] font-bold text-slate-400 uppercase">{t.date}</p></div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-100" />
                      </div>
                    ))}
                    {tasks.filter(t => !t.completed).length === 0 && <div className="p-8 bg-white/50 rounded-3xl border border-dashed border-slate-200 text-center text-[10px] font-bold text-slate-400 italic">Vườn đã được chăm sóc đầy đủ!</div>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Ghi chú mới nhất</h3>
                  <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:border-emerald-200 transition-all cursor-pointer" onClick={() => setActiveTab('notes')}>
                    {notes.slice(0, 1).map(n => (
                      <div key={n.id}>
                        <h4 className="text-[10px] font-black text-slate-800 uppercase mb-2 line-clamp-1">{n.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic">"{n.content}"</p>
                        <div className="mt-4 flex justify-between items-center text-[8px] font-black text-slate-300">
                          <span>NGÀY {n.date}</span>
                          <span className="text-emerald-500 uppercase flex items-center gap-1">Chi tiết <ChevronRight size={8} /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Tài chính (Finance) - Cột Số lượng, Đơn giá, Thành tiền... */}
        {activeTab === 'finance' && (
          <div className="max-w-6xl mx-auto space-y-6 text-left animate-in fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Tài chính vườn</h2>
              <button onClick={() => handleOpenFinanceModal()} className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-lg uppercase flex items-center justify-center gap-2"><Plus size={18} /> Ghi Thu Chi</button>
            </header>
            
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead><tr className="text-[9px] font-black text-slate-400 uppercase border-b border-slate-100"><th className="p-5">Loại</th><th className="p-5">Hạng mục</th><th className="p-5 text-center">SL</th><th className="p-5 text-right">Đơn giá</th><th className="p-5 text-right font-black">Thành tiền</th><th className="p-5 text-center">Ngày</th><th className="p-5 text-right px-10">Thao tác</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {expenses.map(e => (
                    <tr key={e.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-5"><span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${e.type === 'Chi' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>{e.type}</span></td>
                      <td className="p-5 font-bold text-xs uppercase text-slate-700">{e.category}</td>
                      <td className="p-5 text-center text-xs font-bold text-slate-400">{e.quantity}</td>
                      <td className="p-5 text-right text-xs font-medium text-slate-400">{new Intl.NumberFormat('vi-VN').format(e.unitPrice)} đ</td>
                      <td className={`p-5 text-right font-black text-sm ${e.type === 'Chi' ? 'text-slate-800' : 'text-emerald-600'}`}>{new Intl.NumberFormat('vi-VN').format(e.amount)} đ</td>
                      <td className="p-5 text-center text-[9px] text-slate-400 font-black">{e.date}</td>
                      <td className="p-5 text-right px-10 flex justify-end gap-1">
                        <button onClick={() => handleOpenFinanceModal(e)} className="p-2 text-slate-300 hover:text-emerald-500 transition-all"><Edit3 size={14} /></button>
                        <button onClick={() => setExpenses(expenses.filter(i => i.id !== e.id))} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAddingFinance && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddingFinance(false)} />
                <div className="relative bg-white w-full max-w-lg rounded-[40px] p-8 md:p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 text-left">
                   <div className="flex justify-between items-center mb-8"><h3 className="font-black text-slate-800 uppercase tracking-tighter">{editingFinanceId ? 'Cập nhật thu chi' : 'Ghi chép mới'}</h3><button onClick={() => setIsAddingFinance(false)}><X size={20} /></button></div>
                   <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl"><button onClick={() => setFinanceForm({...financeForm, type: 'Thu'})} className={`py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${financeForm.type === 'Thu' ? 'bg-white shadow text-emerald-600' : 'text-slate-400'}`}>Thu nhập</button><button onClick={() => setFinanceForm({...financeForm, type: 'Chi'})} className={`py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${financeForm.type === 'Chi' ? 'bg-white shadow text-red-500' : 'text-slate-400'}`}>Chi phí</button></div>
                     <input type="text" placeholder="Hạng mục..." className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold uppercase text-xs" value={financeForm.category} onChange={e => setFinanceForm({...financeForm, category: e.target.value})} />
                     <div className="grid grid-cols-2 gap-4">
                       <input type="number" placeholder="Số lượng..." className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold" value={financeForm.quantity} onChange={e => setFinanceForm({...financeForm, quantity: e.target.value})} />
                       <input type="number" placeholder="Đơn giá (đ)..." className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold" value={financeForm.unitPrice} onChange={e => setFinanceForm({...financeForm, unitPrice: e.target.value})} />
                     </div>
                     <input type="date" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold text-xs uppercase" value={financeForm.date} onChange={e => setFinanceForm({...financeForm, date: e.target.value})} />
                     <button onClick={handleSaveFinance} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase shadow-lg mt-4 transition-all hover:brightness-110 active:scale-95">Lưu thông tin</button>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Ghi chú (Notes) */}
        {activeTab === 'notes' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in text-left">
            <header className="flex justify-between items-center px-2"><div><h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Sổ tay nhà vườn</h2><p className="text-slate-400 font-bold text-xs">Ghi chép hằng ngày.</p></div><button onClick={() => { setEditingNoteId(null); setNoteForm({title: '', content: ''}); setIsAddingNote(true); }} className="bg-emerald-600 text-white p-3 md:px-6 md:py-3 rounded-2xl shadow-lg flex items-center gap-2"><Plus size={20} /><span className="hidden md:inline font-black text-xs uppercase">Thêm ghi chú</span></button></header>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">{notes.map(n => (<div key={n.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-all"><div className="flex justify-between mb-4"><div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl"><StickyNote size={20} /></div><div className="flex gap-1"><button onClick={() => { setEditingNoteId(n.id); setNoteForm({title: n.title, content: n.content}); setIsAddingNote(true); }} className="p-1.5 text-slate-300 hover:text-emerald-500"><Edit3 size={14} /></button><button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button></div></div><h4 className="font-black text-slate-800 mb-2 uppercase text-xs">{n.title}</h4><p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-4">{n.content}</p><div className="mt-4 pt-4 border-t border-slate-50 text-[9px] font-black text-slate-300 uppercase">{n.date}</div></div>))}</div>
            {isAddingNote && (<div className="fixed inset-0 z-[60] flex items-center justify-center p-4"><div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddingNote(false)} /><div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 text-left"><h3 className="font-black text-slate-800 uppercase mb-6">Ghi chú mới</h3><div className="space-y-4"><input type="text" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value.toUpperCase()})} placeholder="TIÊU ĐỀ..." className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-black text-xs focus:border-emerald-500" /><textarea rows="4" value={noteForm.content} onChange={e => setNoteForm({...noteForm, content: e.target.value})} placeholder="Nội dung..." className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold text-sm focus:border-emerald-500" /><button onClick={() => { if (!noteForm.title) return; if (editingNoteId) setNotes(notes.map(x => x.id === editingNoteId ? {...x, ...noteForm} : x)); else setNotes([{ id: Date.now(), ...noteForm, date: new Date().toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'}) }, ...notes]); setIsAddingNote(false); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase shadow-lg">Lưu vào sổ tay</button></div></div></div>)}
          </div>
        )}

        {/* Tab Kiến thức (Knowledge) */}
        {activeTab === 'knowledge' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in text-left">
            <header className="px-2"><h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Thư viện Kỹ thuật</h2><p className="text-slate-400 font-bold text-xs italic">Kiến thức canh tác chuyên sâu.</p></header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{KNOWLEDGE_BASE.map(item => (<div key={item.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full hover:border-emerald-200 transition-all"><div className="flex items-center gap-4 mb-6"><div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><BookOpen size={24} /></div><div><span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">{item.category}</span><h3 className="text-sm font-black text-slate-800 uppercase mt-1 leading-none">{item.title}</h3></div></div><p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 flex-1">{item.content}</p><button onClick={() => setActiveKnowledge(item)} className="w-full py-3 bg-slate-50 text-slate-800 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">XEM CHI TIẾT <ChevronRight size={14} /></button></div>))}</div>
            {activeKnowledge && (<div className="fixed inset-0 z-[60] flex items-center justify-center p-4"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setActiveKnowledge(null)} /><div className="relative bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 text-left"><div className="flex items-center gap-3 mb-8"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><BookMarked size={24} /></div><div><h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">{activeKnowledge.title}</h3></div></div><p className="text-sm text-slate-800 leading-loose font-medium bg-slate-50 p-6 rounded-3xl">{activeKnowledge.details}</p><button onClick={() => setActiveKnowledge(null)} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Đã hiểu</button></div></div>)}
          </div>
        )}

        {/* Tab Hỏi ✨ AI */}
        {activeTab === 'ai-assistant' && (
          <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] md:h-[80vh] flex flex-col space-y-4 md:space-y-6 text-left animate-in fade-in">
            <header className="px-2"><h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter"><Sparkles className="text-emerald-500" size={20} /> Trợ lý ✨ AI</h2></header>
            <div className="flex-1 bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">{aiChat.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] md:max-w-[85%] p-4 md:p-5 rounded-2xl md:rounded-3xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-800 border'}`}>{m.text}</div></div>))}</div>
              <div className="p-4 bg-slate-50 border-t flex gap-2"><input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAi()} placeholder="Nhập câu hỏi..." className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-emerald-500 font-bold" /><button onClick={askAi} disabled={isAiLoading} className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg">{isAiLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}</button></div>
            </div>
          </div>
        )}

        {/* Tab Soi bệnh ✨ AI */}
        {activeTab === 'ai-vision' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in text-left">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 px-2 uppercase tracking-tighter"><Camera className="text-emerald-500" /> Soi bệnh ✨ AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[40px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center relative hover:border-emerald-200 transition-all cursor-pointer group text-center"><input type="file" accept="image/*" onChange={analyzeImage} className="absolute inset-0 opacity-0 cursor-pointer" /><div className="p-6 bg-emerald-50 text-emerald-500 rounded-full mb-4 mx-auto group-hover:scale-110 transition-all"><Camera size={48} /></div><p className="font-black text-slate-800 uppercase text-xs tracking-widest text-center">Tải ảnh vùng bệnh</p></div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm min-h-[350px] flex flex-col"><div className="flex items-center justify-between mb-6 text-left"><h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Kết quả chẩn đoán ✨ AI</h3><Sparkles size={16} className="text-yellow-400" /></div>{isAnalyzing ? (<div className="flex-1 flex flex-col items-center justify-center gap-4 text-center"><Loader2 className="animate-spin text-emerald-500" size={40} /><span className="text-[10px] font-black text-emerald-600 animate-pulse uppercase">AI đang quét ảnh...</span></div>) : (<div className="flex-1 overflow-y-auto pr-2 font-medium text-sm text-slate-600 leading-loose whitespace-pre-wrap">{analysisResult || "Chưa có ảnh phân tích."}</div>)}</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;