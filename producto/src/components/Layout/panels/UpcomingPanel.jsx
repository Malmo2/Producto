import Upcoming from "../../Upcoming/Upcoming";

function UpcomingPanel({ events }) {
  return (
    <section className="panel">
      <div className="section-header">
        <h3 className="section-title">Upcoming</h3>
        <a className="link" href="#">
          View Calendar
        </a>
      </div>
      <Upcoming events={events} />
    </section>
  );
}

export default UpcomingPanel;
