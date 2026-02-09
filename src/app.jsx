import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// Data simulasi untuk grafik
const data = [
  { name: 'Sen', visits: 400, sales: 240 },
  { name: 'Sel', visits: 300, sales: 139 },
  { name: 'Rab', visits: 200, sales: 980 },
  { name: 'Kam', visits: 278, sales: 390 },
  { name: 'Jum', visits: 189, sales: 480 },
  { name: 'Sab', visits: 239, sales: 380 },
  { name: 'Min', visits: 349, sales: 430 },
];

function App() {
  // Fitur 2: State menu sidebar
  const [menuItems, setMenuItems] = useState(['Dashboard', 'Users', 'Orders', 'Products']);

  const handleAddMenu = () => {
    const name = prompt("Nama menu baru:");
    if (name) setMenuItems([...menuItems, name]);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", backgroundColor: "#f3f4f6" }}>
      
      {/* SIDEBAR */}
      <aside style={{
        width: "240px",
        background: "#7c3aed",
        color: "white",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0px 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "30px", fontSize: "1.5rem" }}>Mineva Admin</h2>
        
        <ul style={{ listStyle: "none", padding: 0, flex: 1 }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ 
              padding: "12px 15px", 
              marginBottom: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.3s",
              backgroundColor: item === "Dashboard" ? "rgba(255,255,255,0.2)" : "transparent"
            }}>
              {item}
            </li>
          ))}
        </ul>

        {/* Fitur 2: Tombol Tambah Menu */}
        <button 
          onClick={handleAddMenu}
          style={{
            padding: "12px",
            background: "#ffffff",
            color: "#7c3aed",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "20px"
          }}>
          + Menu Baru
        </button>
      </aside>

      {/* BODY WRAPPER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Fitur 1: Navbar */}
        <nav style={{
          height: "70px",
          background: "white",
          padding: "0 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}>
          <div style={{ fontWeight: "800", color: "#7c3aed", fontSize: "1.2rem" }}>MINEVA.IO</div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: "#666" }}>Halo, Admin!</span>
            <button style={{
              padding: "8px 20px",
              borderRadius: "50px",
              border: "2px solid #7c3aed",
              color: "#7c3aed",
              background: "white",
              fontWeight: "600",
              cursor: "pointer"
            }}>Profil</button>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main style={{ padding: "30px", overflowY: "auto" }}>
          <header style={{ marginBottom: "25px" }}>
            <h1 style={{ margin: 0, color: "#1f2937" }}>Dashboard Overview</h1>
            <p style={{ color: "#6b7280" }}>Pantau performa toko Anda secara real-time.</p>
          </header>

          {/* Fitur 3: Section Chart */}
          <section style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#374151" }}>Grafik Penjualan Mingguan</h3>
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#7c3aed" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;