import Button from "../button/button";

function TopHeader({ dateLabel, greeting, subtitle }) {
  return (
    <header className="top-header" role="banner">
      <div>
        <p className="eyebrow">{dateLabel}</p>
        <h1 className="headline">{greeting}</h1>
        <p className="subdued">{subtitle}</p>
      </div>
      <div className="top-header__actions">
        <Button variant="secondary">Share</Button>
        <Button variant="primary">New Task</Button>
      </div>
    </header>
  );
}

export default TopHeader;
