import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error("Error fetching:", err));
  }, []);

  return <Dashboard message={message} />;
}

export default App;