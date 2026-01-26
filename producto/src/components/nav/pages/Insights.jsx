import TimerWithReducer from "../../timer/TimerWithReducer"
import '../../timer/timer.css'
import InsightsLayout from "../../layout/InsightsLayout"

function Insights() {
    return (
        <InsightsLayout>
            <TimerWithReducer />
        </InsightsLayout>

    )
}

export default Insights