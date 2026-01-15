import "./App.css";
import Button from "./components/button";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
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
  );
}

export default App;
