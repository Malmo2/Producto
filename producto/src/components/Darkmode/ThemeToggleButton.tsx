import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "./ThemeContext";
import { Button } from "../ui";
import "./ThemeToggleButton.css";

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useContext(ThemeContext) as ThemeContextType;

    return (
        <Button
            variant="outlined"
            onClick={toggleTheme}
            className={theme === 'light' ? 'theme-toggle-light' : 'theme-toggle-dark'}
        >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
    );
};

export default ThemeToggleButton;
