import "./App.css";
import Button from "./components/button";
import Card from "./components/cards/Card";

function App() {
  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Button test</h1>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Button
            variant="primary"
            onClick={() => alert("Start button clicked!")}
          >
            Start
          </Button>

          <Button
            variant="secondary"
            onClick={() => alert("Pause button clicked!")}
          >
            Pause
          </Button>

          <Button
            variant="danger"
            onClick={() => alert("Stop button clicked!")}
          >
            Stop
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          padding: "2rem",
        }}
      >
        <Card>
          <h2>Aktivt arbetsblock</h2>
          <p>25 minuter kvar</p>
          <button>Starta</button>
          <button>Pausa</button>
        </Card>
      </div>
    </>
  );
}

export default App;
