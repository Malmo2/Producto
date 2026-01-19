
import "./App.css";
import Button from "./components/button";
import Card from './components/cards/Card'
import Upcoming from "./components/Upcoming/Upcoming";


const upcomingEvents = [
  { id: 1, title: "Benjame's Playground", date: "2024-07-01", time: '13:00', description: 'Playtime', color: 'purple' },
  { id: 2, title: "Johannes Oatcows milked", date: "2024-07-05", time: '19:00', description: 'Milky', color: 'orange' },
];

function App() {
  return (

    <div style={{ display: "flex", justifyContent: "space-between", padding: "2rem", minHeight: "100vh" }}>
      <div>
        <h1>Button test</h1>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Button
            text="Start"
            variant="primary"
            onClick={() => alert("Start button clicked!")}
          />

          <Button
            text="Pause"
            variant="secondary"
            onClick={() => alert("Pause button clicked!")}
          />

          <Button
            text="Stop"
            variant="danger"
            onClick={() => alert("Stop button clicked!")}
          />
        </div>
      </div>
      <aside style={{ width: "320px", padding: "1rem" }}>
        <Upcoming events={upcomingEvents} />
      </aside>
    </div>
  );




}

export default App;
