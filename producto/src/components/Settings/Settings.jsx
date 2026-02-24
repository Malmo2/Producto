import { useState } from 'react';
import './Settings.css';
import { useContext } from 'react';
import { ThemeContext } from '../Darkmode/ThemeContext';
import { ChangePasswordForm } from '../forms/ChangePasswordForm';
import { Card, CardContent, Typography, TextField, Switch, Box } from '../ui';

function Settings() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [settings] = useState({ notifications: true, theme: 'light' });

    return (
        <Box className="settings-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card className="settings-box password-box">
                <CardContent>
                    <Typography variant="h6" component="h3" style={{ marginBottom: 16 }}>
                        Change Password
                    </Typography>
                    <ChangePasswordForm />
                </CardContent>
            </Card>

            <Card className="settings-box appearance-box">
                <CardContent>
                    <Typography variant="h6" className="settings-box-title" style={{ marginBottom: 16 }}>
                        Appearance
                    </Typography>
                    <Box className="settings-theme-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                        <Box>
                            <Typography variant="subtitle1" className="settings-theme-label">Dark Mode</Typography>
                            <Typography variant="body2" color="muted" className="settings-theme-desc">
                                Switch between light and dark mode
                            </Typography>
                        </Box>
                        <Switch
                            checked={theme === 'dark'}
                            onChange={() => toggleTheme()}
                        />
                    </Box>
                </CardContent>
            </Card>

            <Card className="settings-box timer-box">
                <CardContent>
                    <Typography variant="h6" className="settings-box-title" style={{ marginBottom: 16 }}>
                        Timer defaults
                    </Typography>
                    <Box className="settings-timer-durations" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <Box className="timer-row" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <Typography variant="body2" className="settings-theme-label">Deep work duration</Typography>
                            <TextField defaultValue="25" size="small" />
                        </Box>
                        <Box className="timer-row" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <Typography variant="body2" className="settings-theme-label">Meeting duration</Typography>
                            <TextField defaultValue="45" size="small" />
                        </Box>
                        <Box className="timer-row" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <Typography variant="body2" className="settings-theme-label">Break duration</Typography>
                            <TextField defaultValue="5" size="small" />
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Settings;