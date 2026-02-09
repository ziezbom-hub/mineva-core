function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: "220px",
        background: "#7c3aed",
        color: "white",
        padding: "20px"
      }}>
        <h2>Mineva Admin</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>Dashboard</li>
          <li>Users</li>
          <li>Orders</li>
          <li>Products</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "20px" }}>
        <h1>Dashboard</h1>
        <p>Ini halaman dashboard utama.</p>
      </main>

    </div>
  );
}


export default App;
