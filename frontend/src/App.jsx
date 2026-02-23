import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await axios.post(
        "http://localhost:8000/query",
        { query }
      );

      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer("Error connecting to backend.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>Compliance Intelligence Assistant</h2>

      <textarea
        placeholder="Ask a compliance question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={handleSubmit} style={styles.button}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {answer && (
        <div style={styles.answerBox}>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    fontFamily: "Arial",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
  },
  answerBox: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    background: "#f9f9f9",
  },
};

export default App;