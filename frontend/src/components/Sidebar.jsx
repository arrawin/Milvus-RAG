const LogoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

const JURISDICTIONS = [
    { key: "eu", label: "🌍 EU / GDPR" },
    { key: "us", label: "🇺🇸 US / HIPAA" },
    { key: "india", label: "🇮🇳 India / DPDP" },
    { key: "global", label: "🌐 Global" },
];

const SUGGESTIONS = [
    { emoji: "⚖️", text: "What does GDPR say about data retention?" },
    { emoji: "🔐", text: "What are HIPAA security requirements?" },
    { emoji: "🛡️", text: "Explain India DPDP data principal rights" },
    { emoji: "📋", text: "What is the right to erasure under EU law?" },
    { emoji: "🔔", text: "Summarize breach notification requirements" },
    { emoji: "📝", text: "What constitutes sensitive personal data?" },
];

function Sidebar({ onSuggestion }) {
    return (
        <aside className="sidebar" id="sidebar">

            {/* ── Logo ─────────────────────────────────────── */}
            <div className="sidebar-header">
                <div className="logo-row">
                    <div className="logo-icon"><LogoIcon /></div>
                    <div className="logo-text">
                        <span className="logo-name">Compliance<span>.AI</span></span>
                        <span className="logo-tagline">Document Intelligence</span>
                    </div>
                </div>
            </div>

            <div className="sidebar-body">

                {/* ── System Info ───────────────────────────── */}
                <div className="about-section">
                    <div className="section-label">System</div>
                    <div className="about-card">
                        <div className="about-row">
                            <div className="about-icon blue-tint">🧠</div>
                            <div className="about-info">
                                <span className="about-info-label">Language Model</span>
                                <span className="about-info-value">Llama 3.1 · Groq</span>
                            </div>
                        </div>
                        <div className="about-row">
                            <div className="about-icon orange-tint">🔎</div>
                            <div className="about-info">
                                <span className="about-info-label">Vector Store</span>
                                <span className="about-info-value">Milvus · COSINE</span>
                            </div>
                        </div>
                        <div className="about-row">
                            <div className="about-icon green-tint">📦</div>
                            <div className="about-info">
                                <span className="about-info-label">Knowledge Base</span>
                                <span className="about-info-value">policy_chunks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Jurisdiction Detection ────────────────── */}
                <div className="jurisdiction-section">
                    <div className="section-label">Jurisdiction Detection</div>
                    <div className="jurisdiction-chips">
                        {JURISDICTIONS.map((j) => (
                            <span key={j.key} className={`jur-chip ${j.key}`}>{j.label}</span>
                        ))}
                    </div>
                    <p className="jur-hint">
                        Your query is automatically matched to the relevant regulatory jurisdiction based on keywords like "gdpr", "hipaa", or "dpdp".
                    </p>
                </div>

                {/* ── Suggested Queries ─────────────────────── */}
                <div className="sidebar-suggestions">
                    <div className="section-label">Try asking</div>
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={i}
                            id={`suggestion-${i}`}
                            className="sidebar-suggestion-btn"
                            onClick={() => onSuggestion(s.text)}
                        >
                            <span className="s-emoji">{s.emoji}</span>
                            {s.text}
                        </button>
                    ))}
                </div>

            </div>

            {/* ── Footer ───────────────────────────────────── */}
            <div className="sidebar-footer">
                <div className="model-badge">
                    <div className="model-dot" />
                    <div className="model-info">
                        <div className="model-label">API Status</div>
                        <div className="model-name">localhost:8000 · Connected</div>
                    </div>
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;
