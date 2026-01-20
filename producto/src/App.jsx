import "./App.css";
import Button from "./components/button/button";
import Card from "./components/cards/Card";
// import Upcoming from "./components/Upcoming/Upcoming";
import Timer from "./components/timer/timer";

import Upcoming from "./components/Upcoming/Upcoming";
import ActivityLog from "./components/Activitylog/Activitylog";
import CalendarPopup from "./components/Calendar/Calendar";



function App() {
  

  return (
    <>

    <Card>
      <Button>Hejhej</Button>
      <Button>Hejhej</Button>
      <Button>Hejhej</Button>
      <Button>Hejhej</Button>
    </Card>

    <Timer />
    

    <aside style={{ width: "320px", padding: "1rem" }}>
        <CalendarPopup/>
        <Upcoming />
        <ActivityLog/>


      </aside>
  
  </>
 );
}

export default App;
