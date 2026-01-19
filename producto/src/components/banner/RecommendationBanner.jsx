import Button from "../button/button";

function RecommendationBanner({ eyebrow, title, body }) {
  return (
    <section className="panel recommendation-banner">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="hero-title">{title}</h3>
        <p className="subdued">{body}</p>
        <div className="hero-actions">
          <Button variant="primary">Start Focus Session</Button>
          <Button variant="secondary">Snooze</Button>
        </div>
      </div>
    </section>
  );
}

export default RecommendationBanner;
