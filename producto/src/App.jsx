import './App.css'
import Card from './components/cards/Card'

function App() {

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
      <Card>
        <h2>Aktivt arbetsblock</h2>
        <p>25 minuter kvar</p>
        <button>Starta</button>
        <button>Pausa</button>
      </Card>

    </div>

  )
}

export default App
