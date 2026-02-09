import { useState } from 'react';
import './Settings.css';
import { useContext } from 'react'
import { ThemeContext } from '../Darkmode/ThemeContext';


function Settings() {
    const { theme, toggleTheme} = useContext(ThemeContext)
    const [settings] = useState({
        notifications: true,
        theme: 'light',
    });


  

    return (
        <div>
            <div className="settings-content">
                <div className="settings-box appearance-box">
                    <div className="settings-box-header">
                        <div className="settings-box-title">Appearance</div>
                    </div>
                    <div className="settings-box-body">
                        <div className="settings-theme-row">
                            <div>
                                <div className="settings-theme-label">Theme</div>
                                <div className="settings-theme-desc">Switch between light and dark mode</div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                />
                                <span className="slider round"></span>
                                <span className="theme-icon" role="img" aria-label="theme">{settings.theme === 'dark' ? '🌙' : '☀️'}</span>
                            </label>

                        </div>
                    </div>
                </div>
                <div className="settings-box timer-box">
                    <div className="settings-box-header">
                        <span className="settings-box-title">Timer defaults</span>
                    </div>
                    <div className="settings-box-body">
                        <div className="settings-timer-durations">
                            <label className="timer-row">
                                <div className="settings-theme-label">Deep work duration</div>
                                <input type="text" className="timer-input" defaultValue="25" />
                            </label>

                            <label className="timer-row">
                                <div className="settings-theme-label">Meeting duration</div>
                                <input type="text" className="timer-input" defaultValue="45" />
                            </label>

                            <label className="timer-row">
                                <div className="settings-theme-label">Break duration</div>
                                <input type="text" className="timer-input" defaultValue="5" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;