import { useEffect, useMemo, useState } from "react";
import SessionPopup from "./SessionPopup";
import { useTimer } from "../../contexts/TimerContext";
import { useSessions } from "../../contexts/SessionContext";
import { useEnergy } from "../energy/context/EnergyContext";
import { useAuthState } from "../../contexts/AuthContext";

export default function GlobalSessionPopupManager() {
  const { state, isSessionPopupOpen, closeSessionPopup, resetTimer } =
    useTimer();
  const { addSession } = useSessions();
  const { addLog } = useEnergy();
  const { user } = useAuthState();
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionCategory, setSessionCategory] = useState("Deep Work");
  const [endedAt, setEndedAt] = useState(null);

  const categories = useMemo(
    () => ["Deep Work", "Meeting", "Testing", "On break", "Other"],
    [],
  );

  useEffect(() => {
    if (!isSessionPopupOpen) return;
    setSessionTitle("");
    setSessionCategory("Deep Work");
    setEndedAt(new Date());
  }, [isSessionPopupOpen]);

  function HandleCancel() {
    resetTimer();
    closeSessionPopup();
    setSessionTitle("");
    setSessionCategory("Deep Work");
    setEndedAt(null);
  }

  function handleSave(energyLevel) {
    if (!sessionTitle.trim()) {
      alert("You have to fill in a title");
      return;
    }

    if (energyLevel == null) {
      alert("Pick an energy leve before saving.");
      return;
    }

    const startMs = state.startTime
      ? new Date(state.startTime).getTime()
      : null;
    const endMs = endedAt ? endedAt.getTime() : Date.now();
    const durationInSeconds =
      startMs != null ? Math.max(0, Math.floor((endMs - startMs) / 1000)) : 0;

    const sessionId = crypto.randomUUID?.() ?? String(Date.now());

    const newSession = {
      id: sessionId,
      title: sessionTitle,
      category: sessionCategory,
      startTime: state.startTime,
      endTime: new Date(endMs),
      duration: durationInSeconds,
      date: new Date().toLocaleDateString("sv-SE"),
      energy: energyLevel,
      userName: user?.name || "User",
    };

    addSession(newSession);
    addLog?.(energyLevel, { id: sessionId, sessionId });

    resetTimer();
    closeSessionPopup();
    setSessionTitle("");
    setSessionCategory("Deep Work");
    setEndedAt(null);
  }

  return (
    <SessionPopup
      show={isSessionPopupOpen}
      sessionTitle={sessionTitle}
      sessionCategory={sessionCategory}
      categories={categories}
      onTitleChange={(e) => setSessionTitle(e.target.value)}
      onCategoryChange={(e) => setSessionCategory(e.target.value)}
      onSave={handleSave}
      onCancel={HandleCancel}
    />
  );
}
