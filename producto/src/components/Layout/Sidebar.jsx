import logo from "../../assets/producto-logo.svg";

function Sidebar({ navItems, activeIndex = 0, profileName = "Alex Rivera", profileMeta = "Pro Account" }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src={logo} alt="Producto logo" className="brand-logo" />
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item, index) => (
          <button
            key={item}
            className={`nav-item ${index === activeIndex ? "is-active" : ""}`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="profile">
          <div className="avatar" />
          <div>
            <p className="profile-name">{profileName}</p>
            <p className="profile-meta">{profileMeta}</p>
          </div>
        </div>
        <button className="nav-item nav-item--ghost">Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;
