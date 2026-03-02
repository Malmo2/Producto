import './Settings.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../Darkmode/ThemeContext';
import { ChangePasswordForm } from '../forms/ChangePasswordForm';
import { Card, CardContent, Typography, TextField, Switch, Box, Button } from '../ui';

const TIMER_DEFAULTS_KEY = 'timerDefaults';
const TIMER_START_INTENT_KEY = 'timerStartIntent';
const TIMER_DEFAULTS_FALLBACK = {
    work: 25,
    meeting: 45,
    break: 5,
};

function readTimerDefaults() {
    const savedDefaults = localStorage.getItem(TIMER_DEFAULTS_KEY);
    if (!savedDefaults) return TIMER_DEFAULTS_FALLBACK;

    try {
        const parsed = JSON.parse(savedDefaults);
        return {
            work: Number(parsed?.work) > 0 ? Number(parsed.work) : TIMER_DEFAULTS_FALLBACK.work,
            meeting: Number(parsed?.meeting) > 0 ? Number(parsed.meeting) : TIMER_DEFAULTS_FALLBACK.meeting,
            break: Number(parsed?.break) > 0 ? Number(parsed.break) : TIMER_DEFAULTS_FALLBACK.break,
        };
    } catch {
        return TIMER_DEFAULTS_FALLBACK;
    }
}

function Settings() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [timerDefaults, setTimerDefaults] = useState(readTimerDefaults);
    const [timerInputs, setTimerInputs] = useState(() => {
        const defaults = readTimerDefaults();
        return {
            work: String(defaults.work),
            meeting: String(defaults.meeting),
            break: String(defaults.break),
        };
    });

    useEffect(() => {
        localStorage.setItem(TIMER_DEFAULTS_KEY, JSON.stringify(timerDefaults));
    }, [timerDefaults]);

    const normalizeMinutes = (mode, rawValue) => {
        const numeric = Number(rawValue);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            return TIMER_DEFAULTS_FALLBACK[mode];
        }
        return Math.floor(numeric);
    };

    const handleDurationChange = (mode) => (event) => {
        const raw = event.target.value;

        if (raw === "") {
            setTimerInputs((prev) => ({ ...prev, [mode]: "" }));
            return;
        }

        if (!/^\d+$/.test(raw)) return;

        setTimerInputs((prev) => ({
            ...prev,
            [mode]: raw,
        }));
    };

    const handleDurationBlur = (mode) => () => {
        const minutes = normalizeMinutes(mode, timerInputs[mode]);

        setTimerDefaults((prev) => ({
            ...prev,
            [mode]: minutes,
        }));
        setTimerInputs((prev) => ({
            ...prev,
            [mode]: String(minutes),
        }));
    };

    const handleStartFromSettings = (mode) => {
        const minutes = normalizeMinutes(mode, timerInputs[mode]);
        const nextDefaults = {
            ...timerDefaults,
            [mode]: minutes,
        };

        setTimerDefaults(nextDefaults);
        setTimerInputs((prev) => ({
            ...prev,
            [mode]: String(minutes),
        }));

        localStorage.setItem(TIMER_DEFAULTS_KEY, JSON.stringify(nextDefaults));
        localStorage.setItem('customMinutes', String(minutes));
        localStorage.setItem(TIMER_START_INTENT_KEY, JSON.stringify({ mode, minutes }));
        window.dispatchEvent(new Event('customMinutesChanged'));

        navigate('/timer');
    };

    return (
        <Box className="settings-content">
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
                        <Box className="timer-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <Typography variant="body2" className="settings-theme-label">Deep work duration</Typography>
                            <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <TextField
                                    type="number"
                                    min={1}
                                    size="small"
                                    value={timerInputs.work}
                                    onChange={handleDurationChange('work')}
                                    onBlur={handleDurationBlur('work')}
                                    style={{ width: 90 }}
                                />
                                <Button variant="contained" onClick={() => handleStartFromSettings('work')}>
                                    Start
                                </Button>
                            </Box>
                        </Box>
                        <Box className="timer-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <Typography variant="body2" className="settings-theme-label">Meeting duration</Typography>
                            <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <TextField
                                    type="number"
                                    min={1}
                                    size="small"
                                    value={timerInputs.meeting}
                                    onChange={handleDurationChange('meeting')}
                                    onBlur={handleDurationBlur('meeting')}
                                    style={{ width: 90 }}
                                />
                                <Button variant="contained" onClick={() => handleStartFromSettings('meeting')}>
                                    Start
                                </Button>
                            </Box>
                        </Box>
                        <Box className="timer-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <Typography variant="body2" className="settings-theme-label">Break duration</Typography>
                            <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <TextField
                                    type="number"
                                    min={1}
                                    size="small"
                                    value={timerInputs.break}
                                    onChange={handleDurationChange('break')}
                                    onBlur={handleDurationBlur('break')}
                                    style={{ width: 90 }}
                                />
                                <Button variant="contained" onClick={() => handleStartFromSettings('break')}>
                                    Start
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Settings;