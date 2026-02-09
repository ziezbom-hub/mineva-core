function App() {
  return (
    <div>
      import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Settings, 
  Search, 
  LogOut, 
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  X,
  UserPlus,
  ShoppingCart,
  Edit2,
  Trash2,
  Save,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- KONFIGURASI ROLE & PERMISSIONS ---
const PERMISSIONS = {
  Admin: ['Dashboard', 'Users', 'Orders', 'Products', 'Settings'],
  Editor: ['Dashboard', 'Orders', 'Products'],
  User: ['Dashboard']
};

const INITIAL_ORDERS = [
  { id: "ORD-001", user: "Gilang Ramadan", total: 150000, status: "Paid", date: "2024-01-05" },
  { id: "ORD-002", user: "Siti Aminah", total: 275000, status: "Pending", date: "2024-01-12" },
  { id: "ORD-003", user: "Andi Wijaya", total: 98000, status: "Failed", date: "2024-01-20" },
  { id: "ORD-004", user: "Rina Putri", total: 500000, status: "Paid", date: "2024-02-01" },
  { id: "ORD-005", user: "Dewi Lestari", total: 120000, status: "Pending", date: "2024-02-05" },
];

const INITIAL_USERS = [
  { id: 1, name: "Admin Utama", email: "admin@demo.com", password: "123456", role: "Admin", status: "Active" },
  { id: 2, name: "Siti Editor", email: "editor@demo.com", password: "123456", role: "Editor", status: "Active" },
  { id: 3, name: "Andi User", email: "user@demo.com", password: "123456", role: "User", status: "Active" },
];

const REVENUE_CHART_DATA = [
  { name: 'Jan', revenue: 100 }, { name: 'Feb', revenue: 52 }, { name: 'Mar', revenue: 48 },
  { name: 'Apr', revenue: 61 }, { name: 'Mei', revenue: 55 }, { name: 'Jun', revenue: 67 },
  { name: 'Jul', revenue: 80 }, { name: 'Agu', revenue: 75 }, { name: 'Sep', revenue: 95 },
  { name: 'Okt', revenue: 110 }, { name: 'Nov', revenue: 105 }, { name: 'Des', revenue: 125 },
];

// --- KOMPONEN UI ---
const Badge = ({ variant, children }) => {
  const styles = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    inactive: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600",
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    failed: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    admin: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
    editor: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    user: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${styles[variant.toLowerCase()] || styles.inactive}`}>
      {children}
    </span>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [currentUserLogin, setCurrentUserLogin] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || INITIAL_USERS);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("orders")) || INITIAL_ORDERS);
  const [toasts, setToasts] = useState([]);

  // States untuk Modals & Edit
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ role: '', status: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User', status: 'Active' });

  // Order States
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ user: '', total: '', status: 'Pending' });
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editOrderData, setEditOrderData] = useState({ status: '', total: 0 });

  // Auth States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const hasAccess = (tabName) => {
    if (!currentUserLogin) return false;
    return PERMISSIONS[currentUserLogin.role]?.includes(tabName);
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter(t => t.id !== id)), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem("currentUser", JSON.stringify(found));
      setCurrentUserLogin(found);
      setActiveTab('Dashboard');
      addToast(`Selamat datang, ${found.name}!`);
    } else {
      setErrorMessage("Email atau Password salah!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUserLogin(null);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const userToAdd = { ...newUser, id, password: '123456' };
    setUsers([...users, userToAdd]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'User', status: 'Active' });
    addToast("Pengguna baru berhasil ditambahkan!");
  };

  const requestDelete = (id, target) => {
    if (target === 'user' && currentUserLogin.id === id) {
      addToast("Anda tidak bisa menghapus akun sendiri!", "error");
      return;
    }
    setDeleteConfirmId(id);
    setDeleteTarget(target);
  };

  const confirmDelete = () => {
    if (deleteTarget === 'user') {
      setUsers(prev => prev.filter(u => u.id !== deleteConfirmId));
      addToast("User berhasil dihapus");
    } else {
      setOrders(prev => prev.filter(o => o.id !== deleteConfirmId));
      addToast("Order berhasil dihapus");
    }
    setDeleteConfirmId(null);
    setDeleteTarget(null);
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ role: user.role, status: user.status });
  };

  const handleSaveUserEdit = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: editFormData.role, status: editFormData.status } : u));
    setEditingUserId(null);
    addToast("Data pengguna diperbarui");
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    const newId = `ORD-00${orders.length + 1}`;
    const orderToAdd = { 
      ...newOrder, 
      id: newId, 
      total: Number(newOrder.total), 
      date: new Date().toISOString().split('T')[0] 
    };
    setOrders([orderToAdd, ...orders]);
    setIsAddOrderModalOpen(false);
    setNewOrder({ user: '', total: '', status: 'Pending' });
    addToast("Order baru berhasil dibuat!");
  };

  const startEditOrder = (order) => {
    setEditingOrderId(order.id);
    setEditOrderData({ status: order.status, total: order.total });
  };

  const handleSaveOrderEdit = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: editOrderData.status, total: Number(editOrderData.total) } : o));
    setEditingOrderId(null);
    addToast("Data order berhasil diperbarui");
  };

  // Login View
  if (!currentUserLogin) {
    return (
      <div className="min-h-screen bg-violet-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-900">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-xl border dark:border-slate-800 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold dark:text-white">PurpleAdmin Login</h1>
            <p className="text-slate-400 text-sm mt-1">Silakan masuk ke akun Anda</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && <div className="text-rose-500 text-sm bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-100 dark:border-rose-800">{errorMessage}</div>}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Email</label>
              <input type="email" placeholder="admin@demo.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-violet-500/20" onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Password</label>
              <input type="password" placeholder="••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-violet-500/20" onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg hover:bg-violet-700 transition-all active:scale-95">Masuk</button>
          </form>
          
          <div className="mt-8 pt-6 border-t dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Akun Demo (PW: 123456)</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-2 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 text-[10px] rounded font-bold border border-violet-100 dark:border-violet-800 cursor-pointer" onClick={() => setEmail("admin@demo.com")}>admin@demo.com</span>
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] rounded font-bold border border-blue-100 dark:border-blue-800 cursor-pointer" onClick={() => setEmail("editor@demo.com")}>editor@demo.com</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FD] dark:bg-slate-950 transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-5 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right flex items-center gap-3 font-bold text-sm ${t.type === 'success' ? 'bg-white dark:bg-slate-800 text-emerald-600 border-emerald-100 dark:border-emerald-900/50' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
            {t.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>} {t.message}
          </div>
        ))}
      </div>

      {/* MODALS (User, Order, Delete) - Tetap berfungsi seperti sebelumnya */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border dark:border-slate-800">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold dark:text-white mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Yakin ingin menghapus {deleteTarget === 'user' ? 'user' : 'pesanan'} ini?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm">Batal</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border dark:border-slate-800 relative">
            <button onClick={() => setIsAddUserModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={20}/></button>
            <h3 className="text-xl font-bold dark:text-white mb-6">Tambah User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none" placeholder="Nama Lengkap" />
              <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none" placeholder="Email" />
              <div className="grid grid-cols-2 gap-4">
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none">
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="User">User</option>
                </select>
                <select value={newUser.status} onChange={e => setNewUser({...newUser, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold mt-4">Simpan User</button>
            </form>
          </div>
        </div>
      )}

      {isAddOrderModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border dark:border-slate-800 relative">
            <button onClick={() => setIsAddOrderModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={20}/></button>
            <h3 className="text-xl font-bold dark:text-white mb-6">Buat Order Baru</h3>
            <form onSubmit={handleAddOrder} className="space-y-4">
              <input required type="text" value={newOrder.user} onChange={e => setNewOrder({...newOrder, user: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none" placeholder="Nama Customer" />
              <input required type="number" value={newOrder.total} onChange={e => setNewOrder({...newOrder, total: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none" placeholder="Total Harga (Rp)" />
              <select value={newOrder.status} onChange={e => setNewOrder({...newOrder, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
              <button type="submit" className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold mt-4">Proses Order</button>
            </form>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg font-black italic text-xl">P</div>
              <span className="text-xl font-bold dark:text-white">PurpleCore</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400"><X size={20}/></button>
          </div>

          {/* Navigasi */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {[
              { id: 'Dashboard', icon: LayoutDashboard },
              { id: 'Users', icon: Users },
              { id: 'Orders', icon: ShoppingBag },
              { id: 'Products', icon: Package },
              { id: 'Settings', icon: Settings },
            ].map((item) => (
              hasAccess(item.id) && (
                <button 
                  key={item.id} 
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none' : 'text-slate-500 hover:bg-violet-50 dark:hover:bg-slate-800'}`}
                >
                  <item.icon size={20} />
                  <span className="font-semibold text-sm">{item.id}</span>
                </button>
              )
            ))}
          </nav>

          {/* User Bottom */}
          <div className="p-4 border-t dark:border-slate-800">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
              <LogOut size={20} /> <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Topbar */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 lg:hidden`}>
              <Menu size={20}/>
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Cari data..." className="w-64 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 outline-none transition-all dark:text-white" />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-amber-400 hover:scale-110 transition-transform">
              {isDark ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-white">{currentUserLogin.name}</p>
                <p className="text-[10px] text-violet-500 font-bold uppercase tracking-wider">{currentUserLogin.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-violet-50 dark:ring-violet-900/20">
                {currentUserLogin.name[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Area Dashboard */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {activeTab === 'Dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Statistik Kartu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Pengguna', val: users.length, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/10' },
                  { label: 'Pendapatan', val: `Rp ${orders.reduce((a,b) => a+b.total, 0).toLocaleString()}`, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
                  { label: 'Total Pesanan', val: orders.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                  { label: 'Pending', val: orders.filter(o => o.status === 'Pending').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                    <h3 className={`text-2xl font-black ${stat.color}`}>{stat.val}</h3>
                  </div>
                ))}
              </div>
              
              {/* Grafik */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold dark:text-white text-lg">Tren Pendapatan</h3>
                  <div className="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 text-xs font-bold rounded-lg uppercase">Tahun 2024</div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_CHART_DATA}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#F1F5F9"} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#7C3AED', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-black dark:text-white">Manajemen Pengguna</h1>
                <button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-bold rounded-xl text-sm shadow-lg hover:bg-violet-700 transition-all">
                  <UserPlus size={18}/> Tambah Pengguna
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 overflow-x-auto shadow-sm">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50/50 dark:bg-slate-700/30">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama & Email</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-700">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold dark:text-white">{user.name}</p>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id ? (
                            <select value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})} className="text-xs bg-slate-100 dark:bg-slate-700 rounded-lg p-2 outline-none border-none ring-1 ring-slate-200 dark:ring-slate-600">
                              <option value="Admin">Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="User">User</option>
                            </select>
                          ) : (
                            <Badge variant={user.role}>{user.role}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id ? (
                            <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="text-xs bg-slate-100 dark:bg-slate-700 rounded-lg p-2 outline-none border-none ring-1 ring-slate-200 dark:ring-slate-600">
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          ) : (
                            <Badge variant={user.status}>{user.status}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {editingUserId === user.id ? (
                              <button onClick={() => handleSaveUserEdit(user.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"><Save size={18}/></button>
                            ) : (
                              <button onClick={() => startEditUser(user)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"><Edit2 size={18}/></button>
                            )}
                            <button onClick={() => requestDelete(user.id, 'user')} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Orders' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-black dark:text-white">Kelola Pesanan</h1>
                <button onClick={() => setIsAddOrderModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg hover:bg-emerald-700 transition-all">
                  <ShoppingCart size={18}/> Buat Pesanan
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 overflow-x-auto shadow-sm">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50/50 dark:bg-slate-700/30">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pelanggan</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Bayar</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-700">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-violet-500">{order.id}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold dark:text-white">{order.user}</p>
                          <p className="text-[10px] text-slate-400">{order.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          {editingOrderId === order.id ? (
                            <input type="number" value={editOrderData.total} onChange={e => setEditOrderData({...editOrderData, total: e.target.value})} className="w-32 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-violet-500/20" />
                          ) : (
                            <span className="text-sm font-bold">Rp {order.total.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingOrderId === order.id ? (
                            <select value={editOrderData.status} onChange={e => setEditOrderData({...editOrderData, status: e.target.value})} className="text-xs bg-slate-100 dark:bg-slate-700 rounded-lg p-2 outline-none ring-1 ring-slate-200 dark:ring-slate-600">
                              <option value="Paid">Paid</option>
                              <option value="Pending">Pending</option>
                              <option value="Failed">Failed</option>
                            </select>
                          ) : (
                            <Badge variant={order.status}>{order.status}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-1">
                            {editingOrderId === order.id ? (
                              <button onClick={() => handleSaveOrderEdit(order.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"><Save size={18}/></button>
                            ) : (
                              <button onClick={() => startEditOrder(order)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"><Edit2 size={18}/></button>
                            )}
                            <button onClick={() => requestDelete(order.id, 'order')} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center mb-6">
                <Package size={48} className="text-violet-600" />
              </div>
              <h2 className="text-xl font-bold dark:text-white">Modul Produk Aktif</h2>
              <p className="text-sm">Kelola stok dan inventaris toko Anda di sini.</p>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-sm animate-in fade-in duration-500">
              <h1 className="text-2xl font-black mb-8 dark:text-white">Pengaturan Sistem</h1>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold dark:text-white">Mode Pemeliharaan</p>
                    <p className="text-xs text-slate-400 mt-1">Sembunyikan website dari pengunjung publik.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold dark:text-white">Notifikasi Email</p>
                    <p className="text-xs text-slate-400 mt-1">Kirim laporan penjualan harian via email.</p>
                  </div>
                  <div className="w-12 h-6 bg-violet-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <button className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl shadow-lg hover:bg-violet-700 transition-all mt-4">Simpan Perubahan</button>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
    </div>
  );
}

export default App;
