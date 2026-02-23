import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

const API_BASE = "http://localhost:8000";

let _id = 1;
const uid = () => _id++;

function App() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Close sidebar on outside click (mobile) */
  useEffect(() => {
    const handler = (e) => {
      const sb = document.getElementById("sidebar");
      if (sidebarOpen && sb && !sb.contains(e.target)) setSidebarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  /* ── Send query to POST /query ─────────────────────────── */
  const handleSend = async () => {
    const text = query.trim();
    if (!text || loading) return;

    setError(null);

    /* Add user message immediately */
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content: text, timestamp: new Date() },
    ]);
    setQuery("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/query`, { query: text });

      /*
        Real response shape:
          { query, jurisdiction_detected, answer }   — success
          { message }                                — no results found
      */
      if (data.message) {
        /* Backend returned "No relevant results found" */
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            type: "no-results",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "ai",
            content: data.answer,
            jurisdiction: data.jurisdiction_detected ?? null,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Could not reach the backend. Make sure the FastAPI server is running on port 8000.";
      setError(msg);

      /* Remove the optimistic user message on hard error */
      setMessages((prev) => prev.slice(0, -1));
      setQuery(text);           // restore so user can retry
    } finally {
      setLoading(false);
    }
  };

  /* ── Suggestion chip ───────────────────────────────────── */
  const handleSuggestion = (text) => {
    setQuery(text);
    setSidebarOpen(false);
    setTimeout(() => document.getElementById("chat-input")?.focus(), 60);
  };

  /* ── Clear ─────────────────────────────────────────────── */
  const handleClear = () => {
    setMessages([]);
    setError(null);
    setQuery("");
  };

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,.35)",
            backdropFilter: "blur(2px)",
            zIndex: 9,
          }}
        />
      )}

      {/* Sidebar */}
      <div id="sidebar" className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <Sidebar onSuggestion={handleSuggestion} />
      </div>

      {/* Main chat */}
      <main className="main-area">
        <ChatArea
          messages={messages}
          loading={loading}
          error={error}
          query={query}
          setQuery={setQuery}
          onSend={handleSend}
          onClear={handleClear}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />
      </main>
    </div>
  );
}

export default App;