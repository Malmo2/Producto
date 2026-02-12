import React, { useContext } from "react";
import { ThemeContext, ThemeContextType } from "./ThemeContext";
import "./ThemeToggleButton.css";

const ThemeToggleButton: React.FC = () => {
    const {theme, toggleTheme} = useContext(ThemeContext) as ThemeContextType;

    return React.createElement(
        'button',
        { onClick: toggleTheme, className: `button ${theme}` },
        `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`
    );

}


export default ThemeToggleButton
