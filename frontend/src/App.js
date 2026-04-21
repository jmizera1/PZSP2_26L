import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/";
    const fetchUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error("Error fetching:", err));
  }, []);

  return <Dashboard message={message} />;
}

export default App;