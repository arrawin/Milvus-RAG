/* Renders one AI or user message.
   AI messages display jurisdiction_detected tag when present. */

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const JUR_MAP = {
    EU: { cls: "eu", label: "🌍 EU / GDPR" },
    US: { cls: "us", label: "🇺🇸 US / HIPAA" },
    India: { cls: "india", label: "🇮🇳 India / DPDP" },
};

function MessageBubble({ message }) {
    const isUser = message.role === "user";
    const jur = !isUser && message.jurisdiction ? JUR_MAP[message.jurisdiction] : null;

    return (
        <div className="message-group">
            <div className={`message-row ${isUser ? "user" : "ai"}`}>
                <div className={`avatar ${isUser ? "user-avatar" : "ai-avatar"}`}>
                    {isUser ? "U" : "AI"}
                </div>
                <div className={`bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
                    {message.content}
                </div>
            </div>

            {/* Timestamp row */}
            <div style={{ paddingLeft: isUser ? 0 : "38px", paddingRight: isUser ? "38px" : 0, textAlign: isUser ? "right" : "left" }}>
                <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>

            {/* Jurisdiction tag — only on AI messages with a detected jurisdiction */}
            {jur && (
                <div>
                    <span className={`jurisdiction-tag ${jur.cls}`}>
                        {jur.label} detected
                    </span>
                </div>
            )}
        </div>
    );
}

export default MessageBubble;
