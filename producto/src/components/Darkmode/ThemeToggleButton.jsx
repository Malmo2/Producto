import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import "./ThemeToggleButton.css"

const ThemeToggleButton = () => {
    const {theme, toggleTheme} = useContext(ThemeContext)

    return(
        <button onClick={toggleTheme} className={`button ${theme}`}>

        Switch to {theme === 'light' ? 'dark' : 'Light'} Mode
        </button>
    )

}


export default ThemeToggleButton
