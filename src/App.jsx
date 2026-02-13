import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, Package, Settings, Search, LogOut, 
  Edit2, Trash2, Bell, TrendingUp, CheckCircle2, AlertTriangle, Save, X, 
  UserPlus, ShoppingCart, ChevronLeft, ChevronRight, BarChart3, Menu, 
  Lock, Sun, Moon, AlertCircle, Plus, Calendar, User, DollarSign
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// --- INTEGRATED HOOK: useNotifications ---
// Logika notifikasi disatukan di sini untuk menghindari error "Could not resolve"
const useNotifications = () => {
  const STORAGE_KEY = 'dashboard_notifications';
  
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 1, type: 'order', title: 'Pesanan Baru', message: 'ORD-005 baru saja masuk ke sistem.', isRead: false, time: '2 menit lalu' },
        { id: 2, type: 'info', title: 'Update Sistem', message: 'Pembersihan database berhasil dilakukan.', isRead: true, time: '1 jam lalu' }
      ];
    } catch (e) {
      return [];
    }
  });

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    isNotifOpen,
    setIsNotifOpen,
    unreadCount,
    markAsRead,
    deleteNotif
  };
};

// --- INTEGRATED COMPONENT: NotificationPanelDropdown ---
// Komponen UI dropdown notifikasi yang terisolasi
const NotificationPanelDropdown = ({ isOpen, onClose, notifications, markAsRead, deleteNotif }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-2xl rounded-[1.5rem] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="font-bold text-sm dark:text-white">Notifikasi</h3>
        <span className="text-[10px] bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
          {notifications.filter(n => !n.isRead).length} Baru
        </span>
      </div>

      <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-xs text-slate-400 font-medium">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="divide-y dark:divide-slate-700">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-violet-50/20 dark:bg-violet-500/5' : ''}`}
              >
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${!notif.isRead ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-400'}`}>
                  {notif.type === 'order' ? <ShoppingCart size={16}/> : <AlertCircle size={16}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{notif.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-slate-300 font-medium mt-1">{notif.time}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- CUSTOM HOOK: useLocalStorage ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

const INITIAL_ORDERS = [
  { id: "ORD-001", user: "Gilang Bradpitt", total: 150000, status: "Paid", date: "2025-01-05" },
  { id: "ORD-002", user: "Siti Aminah", total: 275000, status: "Pending", date: "2025-01-12" },
  { id: "ORD-003", user: "Andi Wijaya", total: 98000, status: "Failed", date: "2025-01-20" },
  { id: "ORD-004", user: "Rina Putri", total: 500000, status: "Paid", date: "2025-02-01" },
  { id: "ORD-005", user: "Dewi Lestari", total: 120000, status: "Pending", date: "2025-02-05" },
];

const INITIAL_USERS = [
  { id: 1, name: "Admin Utama", email: "admin@demo.com", password: "123456", role: "Admin", status: "Active" },
  { id: 2, name: "Siti Editor", email: "editor@demo.com", password: "123456", role: "Editor", status: "Active" },
  { id: 3, name: "Andi User", email: "user@demo.com", password: "123456", role: "User", status: "Offline" },
];

const REVENUE_CHART_DATA = [
  { name: 'Jan', revenue: 100 }, { name: 'Feb', revenue: 52 }, { name: 'Mar', revenue: 48 },
  { name: 'Apr', revenue: 61 }, { name: 'Mei', revenue: 55 }, { name: 'Jun', revenue: 67 },
  { name: 'Jul', revenue: 80 }, { name: 'Agu', revenue: 75 }, { name: 'Sep', revenue: 95 },
  { name: 'Okt', revenue: 110 }, { name: 'Nov', revenue: 105 }, { name: 'Des', revenue: 125 },
];

const Badge = ({ variant, children }) => {
  const styles = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    offline: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600",
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    failed: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    admin: "bg-violet-100 text-violet-700 border-violet-200",
    editor: "bg-blue-100 text-blue-700 border-blue-200",
    user: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${styles[variant.toLowerCase()] || styles.offline}`}>
      {children}
    </span>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('is_logged_in', false);
  const [currentUser, setCurrentUser] = useLocalStorage('current_user', null);
  const [isDark, setIsDark] = useLocalStorage('theme_dark', false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('sidebar_collapsed', false);
  const [activeTab, setActiveTab] = useLocalStorage('active_tab', 'Dashboard');
  const [users, setUsers] = useLocalStorage('db_users', INITIAL_USERS);
  const [orders, setOrders] = useLocalStorage('db_orders', INITIAL_ORDERS);

  // Inisialisasi Hook Notifikasi Terintegrasi
  const {
    notifications,
    isNotifOpen,
    setIsNotifOpen,
    unreadCount,
    markAsRead,
    deleteNotif
  } = useNotifications();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({ name: '', email: '', password: '', role: 'User', status: 'Active' });
  const [editingUser, setEditingUser] = useState(null);
  const [editUserFormData, setEditUserFormData] = useState({ role: '', status: '' });
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [newOrderFormData, setNewOrderFormData] = useState({ user: '', total: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderFormData, setEditOrderFormData] = useState({ status: '' });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter(t => t.id !== id)), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginError("");
      addToast(`Selamat datang kembali, ${user.name}!`);
    } else {
      setLoginError("Email atau Password salah.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('Dashboard');
  };

  const handleAddUser = () => {
    if (!newUserFormData.name || !newUserFormData.email || !newUserFormData.password) {
      addToast("Mohon lengkapi semua data!", "error");
      return;
    }
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...newUserFormData
    };
    setUsers([...users, newUser]);
    setIsAddUserModalOpen(false);
    setNewUserFormData({ name: '', email: '', password: '', role: 'User', status: 'Active' });
    addToast("Pengguna baru berhasil ditambahkan");
  };

  const startEditingUser = (user) => {
    setEditingUser(user);
    setEditUserFormData({ role: user.role, status: user.status });
  };

  const saveUserEdit = () => {
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editUserFormData } : u));
    setEditingUser(null);
    addToast("Data pengguna berhasil diperbarui");
  };

  const deleteUser = (userId) => {
    if (userId === currentUser.id) {
      addToast("Tidak dapat menghapus akun sendiri!", "error");
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    addToast("Pengguna berhasil dihapus");
  };

  const handleAddOrder = () => {
    if (!newOrderFormData.user || !newOrderFormData.total || !newOrderFormData.date) {
      addToast("Mohon lengkapi data pesanan!", "error");
      return;
    }
    const orderIdNum = orders.length > 0 ? parseInt(orders[orders.length - 1].id.split('-')[1]) + 1 : 1;
    const newOrder = {
      id: `ORD-${String(orderIdNum).padStart(3, '0')}`,
      user: newOrderFormData.user,
      total: Number(newOrderFormData.total),
      status: newOrderFormData.status,
      date: newOrderFormData.date
    };
    setOrders([...orders, newOrder]);
    setIsAddOrderModalOpen(false);
    setNewOrderFormData({ user: '', total: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
    addToast("Pesanan baru berhasil ditambahkan");
  };

  const startEditingOrder = (order) => {
    setEditingOrder(order);
    setEditOrderFormData({ status: order.status });
  };

  const saveOrderEdit = () => {
    setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...editOrderFormData } : o));
    setEditingOrder(null);
    addToast("Status pesanan berhasil diperbarui");
  };

  const deleteOrder = (orderId) => {
    setOrders(orders.filter(o => o.id !== orderId));
    addToast("Pesanan berhasil dihapus");
  };

  const NAV_ITEMS = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Users', icon: Users },
    { id: 'Orders', icon: ShoppingBag },
    { id: 'Products', icon: Package },
    { id: 'Analytics', icon: BarChart3 },
    { id: 'Settings', icon: Settings },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans transition-colors duration-500">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30 mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black dark:text-white tracking-tight">AdminPanel</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Silakan masuk untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-900/50 text-rose-600 rounded-2xl text-sm font-bold">
                <AlertCircle size={18} /> {loginError}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
              <input 
                required
                type="email" 
                placeholder="admin@demo.com" 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white transition-all"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                required
                type="password" 
                placeholder="••••••••" 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white transition-all"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-violet-500/20 hover:bg-violet-700 transform active:scale-[0.98] transition-all">
              Login ke Dashboard
            </button>
          </form>

          <div className="mt-10 pt-8 border-t dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Demo Access Only</p>
            <div className="flex flex-col gap-2 items-center text-xs font-semibold text-slate-500">
              <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">User: admin@demo.com</span>
              <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">Pass: 123456</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r dark:border-slate-800 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col p-5">
          <div className={`flex items-center gap-3 mb-10 transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className="shrink-0 w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg font-black text-xl">A</div>
            <span className={`text-xl font-bold dark:text-white whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              AdminPanel
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="ml-auto p-1 lg:hidden text-slate-400">
              <X size={20}/>
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 custom-scrollbar overflow-y-auto overflow-x-hidden">
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} 
                className={`group relative flex items-center gap-3 rounded-xl transition-all duration-200 
                  ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 w-full'}
                  ${activeTab === item.id 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                    : 'text-slate-500 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400'}
                `}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                  {item.id}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t dark:border-slate-800">
             <button 
                onClick={handleLogout}
                className={`group flex items-center gap-3 text-slate-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 rounded-xl transition-all 
                ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 w-full'}
              `}>
              <LogOut size={20} className="shrink-0" /> 
              <span className={`text-sm transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>Logout</span>
            </button>
          </div>
        </div>

        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3.5 top-20 w-7 h-7 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-full hidden lg:flex items-center justify-center text-slate-400 hover:text-violet-600 shadow-sm z-50"
        >
          {isSidebarCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
        </button>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="sticky top-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 z-30 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl lg:hidden">
              <Menu size={20}/>
            </button>
            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Cari data..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800 border-none rounded-xl outline-none text-sm focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={() => setIsDark(!isDark)} className="p-2.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
              {isDark ? <Sun size={20}/> : <Moon size={20}/>}
            </button>

            {/* Container Lonceng Notifikasi */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 border-2 border-white dark:border-slate-900 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationPanelDropdown
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
                markAsRead={markAsRead}
                deleteNotif={deleteNotif}
              />
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-white leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentUser?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg">{currentUser?.name?.[0]}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 scroll-smooth">
          {activeTab === 'Dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', val: users.length, color: 'text-violet-500', icon: Users },
                  { label: 'Revenue', val: `Rp ${orders.reduce((a,b) => a+b.total, 0).toLocaleString()}`, color: 'text-emerald-500', icon: TrendingUp },
                  { label: 'Orders', val: orders.length, color: 'text-blue-500', icon: ShoppingBag },
                  { label: 'Pending', val: orders.filter(o => o.status === 'Pending').length, color: 'text-amber-500', icon: AlertTriangle },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={24}/>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                      <h3 className={`text-xl font-black ${stat.color}`}>{stat.val}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
                <h3 className="font-bold mb-6 dark:text-white">Ikhtisar Pendapatan</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_CHART_DATA}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#F1F5F9"} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'Users' || activeTab === 'Orders') && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black dark:text-white">
                  {activeTab === 'Users' ? 'Daftar Pengguna' : 'Daftar Pesanan'}
                </h1>
                <button onClick={() => activeTab === 'Users' ? setIsAddUserModalOpen(true) : setIsAddOrderModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-bold rounded-xl text-sm shadow-lg hover:bg-violet-700 transition-all active:scale-95">
                  {activeTab === 'Users' ? <UserPlus size={18}/> : <ShoppingCart size={18}/>} Tambah Baru
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-700">
                      <tr>
                        {activeTab === 'Users' ? (
                          <>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pengguna</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jabatan</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          </>
                        ) : (
                          <>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Pesanan</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          </>
                        )}
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700">
                      {(activeTab === 'Users' ? users : orders).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold dark:text-white">{activeTab === 'Users' ? item.name : item.id}</p>
                            <p className="text-[11px] text-slate-400">{activeTab === 'Users' ? item.email : item.date}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-sm">
                            {activeTab === 'Users' ? (
                              <Badge variant={item.role}>{item.role}</Badge>
                            ) : (
                              <div className="flex flex-col">
                                <span className="dark:text-white">{item.user}</span>
                                <span className="text-[11px] text-violet-500 font-bold">Rp {item.total.toLocaleString()}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={item.status}>{item.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                               <button onClick={() => activeTab === 'Users' ? startEditingUser(item) : startEditingOrder(item)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-700 rounded-lg transition-all"><Edit2 size={16}/></button>
                               <button onClick={() => activeTab === 'Users' ? deleteUser(item.id) : deleteOrder(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-all"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Analytics' && (
             <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 animate-in fade-in">
              <BarChart3 size={64} className="mb-4 opacity-20" />
              <p className="font-bold">Modul Analytics</p>
              <p className="text-xs">Visualisasi data lanjutan akan muncul di sini.</p>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 animate-in zoom-in-95 duration-300">
              <h1 className="text-xl font-bold mb-8 dark:text-white">Pengaturan Global</h1>
              <div className="space-y-6 text-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold">Notifikasi Sistem</p>
                    <p className="text-xs text-slate-500">Aktifkan push notification di browser.</p>
                  </div>
                  <div className="w-12 h-6 bg-violet-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODALS --- */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl border dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold dark:text-white">Tambah Pengguna Baru</h2>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Lengkap</label><input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white" value={newUserFormData.name} onChange={(e) => setNewUserFormData({...newUserFormData, name: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat Email</label><input type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white" value={newUserFormData.email} onChange={(e) => setNewUserFormData({...newUserFormData, email: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label><input type="password" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white" value={newUserFormData.password} onChange={(e) => setNewUserFormData({...newUserFormData, password: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white" value={newUserFormData.role} onChange={(e) => setNewUserFormData({...newUserFormData, role: e.target.value})} >
                    <option value="Admin">Admin</option><option value="Editor">Editor</option><option value="User">User</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white" value={newUserFormData.status} onChange={(e) => setNewUserFormData({...newUserFormData, status: e.target.value})} >
                    <option value="Active">Active</option><option value="Pending">Pending</option><option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <button onClick={handleAddUser} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-violet-500/20 hover:bg-violet-700 transition-all">Simpan Pengguna</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl border dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold dark:text-white">Edit Pengguna</h2>
              <button onClick={() => setEditingUser(null)} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={20}/></button>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800"><p className="text-sm font-bold dark:text-white">{editingUser.name}</p><p className="text-xs text-slate-400">{editingUser.email}</p></div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jabatan / Role</label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white" value={editUserFormData.role} onChange={(e) => setEditUserFormData({ ...editUserFormData, role: e.target.value })}>
                  <option value="Admin">Admin</option><option value="Editor">Editor</option><option value="User">User</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status Akun</label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white" value={editUserFormData.status} onChange={(e) => setEditUserFormData({ ...editUserFormData, status: e.target.value })}>
                  <option value="Active">Active</option><option value="Pending">Pending</option><option value="Offline">Offline</option>
                </select>
              </div>
              <button onClick={saveUserEdit} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-violet-500/20 hover:bg-violet-700 transition-all">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST --- */}
      <div className="fixed bottom-6 right-6 z-[110] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-5 py-3 bg-white dark:bg-slate-800 border-l-4 ${t.type === 'error' ? 'border-rose-500' : 'border-violet-500'} rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right`}>
            {t.type === 'error' ? <AlertCircle size={18} className="text-rose-500"/> : <CheckCircle2 size={18} className="text-emerald-500"/>}
            <span className="text-sm font-bold dark:text-white">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}