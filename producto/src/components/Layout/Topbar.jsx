import Button from "../button/button";

function Topbar({ dateLabel, greeting, subtitle }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{dateLabel}</p>
        <h1 className="headline">{greeting}</h1>
        <p className="subdued">{subtitle}</p>
      </div>
      <div className="topbar__actions">
        <Button variant="secondary">Share</Button>
        <Button variant="primary">New Task</Button>
      </div>
    </header>
  );
}

export default Topbar;
