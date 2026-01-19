function DashboardLayout({ sidebar, children }) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar-wrap">{sidebar}</aside>
      <main className="main-area" role="main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
