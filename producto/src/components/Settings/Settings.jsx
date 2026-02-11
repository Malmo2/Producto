import { useState } from 'react';
import './Settings.css';
import { useContext } from 'react'
import { ThemeContext } from '../Darkmode/ThemeContext.jsx';

function Settings() {
    const { theme, toggleTheme} = useContext(ThemeContext)
    const [settings, setSettings] = useState({
        notifications: true,
        theme: 'light',
    });


    const handleChangeTheme = (theme) => {
        setSettings(prev => ({ ...prev, theme }));
    };

    return (
        <div>
            <div className="settings-content">
                <div className="settings-box appearance-box">
                    <div className="settings-box-header">
                        <span role="img" aria-label="appearance" style={{fontSize: '1.3em', marginRight: 8}}></span>
                        <span className="settings-box-title">Appearance</span>
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
            </div>
        </div>
    );
}

export default Settings;