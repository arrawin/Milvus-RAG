import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

/* ── Icons ──────────────────────────────────────────────── */
const SendIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
);

const MenuIcon = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

/* ── Typing Indicator ───────────────────────────────────── */
function TypingIndicator() {
    return (
        <div className="typing-indicator">
            <div className="avatar ai-avatar">AI</div>
            <div className="typing-bubble">
                <span className="typing-text">Searching knowledge base…</span>
                <div className="dot-pulse"><span /><span /><span /></div>
            </div>
        </div>
    );
}

/* ── Empty State ────────────────────────────────────────── */
function EmptyState() {
    return (
        <div className="chat-container">
            <div className="messages-inner">
                <div className="empty-state">
                    <div className="empty-icon">
                        <ShieldIcon />
                    </div>
                    <h2>Ask Compliance.AI</h2>
                    <p>
                        Query your regulatory knowledge base in plain English. Jurisdiction —&nbsp;GDPR, HIPAA, or DPDP — is detected automatically from your question.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ── ChatArea ───────────────────────────────────────────── */
function ChatArea({ messages, loading, error, query, setQuery, onSend, onClear, onMenuToggle }) {
    const endRef = useRef(null);
    const textareaRef = useRef(null);

    /* Auto-scroll to latest message */
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    /* Auto-resize textarea */
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const hasMessages = messages.length > 0;

    return (
        <>
            {/* ── Topbar ───────────────────────────────────── */}
            <header className="topbar">
                <div className="topbar-left">
                    <button
                        id="menu-toggle-btn"
                        className="menu-btn"
                        onClick={onMenuToggle}
                        title="Toggle sidebar"
                    >
                        <MenuIcon />
                    </button>
                    <div className="topbar-title-wrap">
                        <div className="topbar-title">Compliance Intelligence</div>
                        <div className="topbar-subtitle">
                            Milvus · Groq · Llama 3.1-8b
                        </div>
                    </div>
                </div>

                <div className="topbar-right">
                    {hasMessages && (
                        <button id="clear-chat-btn" className="topbar-btn" onClick={onClear}>
                            <TrashIcon /> Clear chat
                        </button>
                    )}
                </div>
            </header>

            {/* ── Messages / Empty ─────────────────────────── */}
            {!hasMessages && !loading ? (
                <EmptyState />
            ) : (
                <div className="chat-container" id="chat-messages">
                    <div className="messages-inner">

                        {messages.map((msg) =>
                            msg.type === "no-results" ? (
                                <div key={msg.id} className="no-results-msg">
                                    <div className="avatar ai-avatar">AI</div>
                                    <div className="no-results-bubble">⚠️ {msg.content}</div>
                                </div>
                            ) : (
                                <MessageBubble key={msg.id} message={msg} />
                            )
                        )}

                        {error && (
                            <div className="error-banner">⚠️ {error}</div>
                        )}

                        {loading && <TypingIndicator />}

                        <div ref={endRef} />
                    </div>
                </div>
            )}

            {/* ── Input ─────────────────────────────────────── */}
            <div className="input-area">
                <div className="input-inner">
                    <div className="input-box">
                        <textarea
                            id="chat-input"
                            ref={textareaRef}
                            className="chat-input"
                            placeholder="Ask a compliance question — e.g. What does GDPR say about the right to erasure?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={loading}
                        />
                        <button
                            id="send-btn"
                            className="send-btn"
                            onClick={onSend}
                            disabled={!query.trim() || loading}
                            title="Send (Enter)"
                        >
                            <SendIcon />
                        </button>
                    </div>

                    <div className="input-footer">
                        <span className="input-hint">
                            <kbd className="kbd">Enter</kbd>&nbsp;to send &nbsp;·&nbsp;
                            <kbd className="kbd">Shift+Enter</kbd>&nbsp;for new line
                        </span>
                        <span className="input-footer-right">
                            POST /query → llama-3.1-8b-instant
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatArea;
