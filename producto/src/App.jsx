
import "./App.css";
import ActivityLog from "./components/Activitylog/Activitylog";
import Button from "./components/button";
import CalendarPopup from "./components/Calendar/Calendar";
import Card from './components/cards/Card'
import Upcoming from "./components/Upcoming/Upcoming";

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
        <CalendarPopup/>
        <Upcoming />
        <ActivityLog/>
        
        
      </aside>
      
      
    </div>
  );




}

export default App;
